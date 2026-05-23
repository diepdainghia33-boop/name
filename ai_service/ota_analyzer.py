import os
import re


class OTAAnalyzer:
    def __init__(self):
        self.transformer = None
        self.negations = ["không", "chẳng", "chưa", "đừng", "hết", "ít"]
        self.intensifiers = {
            "rất": 1.5, "quá": 1.6, "lắm": 1.4, "vô cùng": 2.0, "cực kỳ": 1.8,
            "hơi": 0.6, "khá": 0.8, "chút": 0.5
        }
        self.conjunctions = ["nhưng", "tuy nhiên", "mà"]

        if os.getenv("DISABLE_TRANSFORMERS", "0") in ("1", "true", "yes"):
            print("[OTA] Ontology-only mode (DISABLE_TRANSFORMERS).")
            return

        print("[OTA] Checking model status...")
        try:
            from transformers import pipeline
            self.transformer = pipeline(
                "sentiment-analysis",
                model="wonrax/phobert-base-vietnamese-sentiment",
                device=-1
            )
            print("[OTA] Transformer loaded.")
        except Exception as e:
            print(f"[OTA] HuggingFace unavailable: {e}")
            print("[OTA] Switching to Ontology-Only mode.")

    def analyze(self, text):
        text_lower = text.lower()

        base_label = "POSITIVE"
        base_score = 0.8

        if self.transformer:
            try:
                tr_result = self.transformer(text)[0]
                base_label = tr_result['label']
                base_score = tr_result['score']
            except Exception:
                pass

        parts = re.split('|'.join(self.conjunctions), text_lower)
        target_text = parts[-1].strip()

        is_negated = any(neg in target_text for neg in self.negations)

        if is_negated:
            base_label = "NEGATIVE" if base_label == "POSITIVE" else "POSITIVE"

        for word, val in self.intensifiers.items():
            if word in target_text:
                break

        if base_label in ["POSITIVE", "POS"]:
            final_class = "P2 (Strong Positive)" if base_score > 0.8 else "P1 (Positive)"
        else:
            final_class = "N2 (Strong Negative)" if base_score > 0.8 else "N1 (Negative)"

        return {
            "text": text,
            "ota_class": final_class,
            "confidence": min(round(base_score * 100, 2), 100.0) if self.transformer else 100,
            "mode": "Hybrid" if self.transformer else "Ontology-Only"
        }


ota_engine = OTAAnalyzer()
