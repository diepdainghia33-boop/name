<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForceCors
{
    public function handle(Request $request, Closure $next): Response
    {
        $origin = $request->headers->get('Origin');

        if ($request->isMethod('OPTIONS') && $this->isApiRequest($request)) {
            $response = response('', 204);
        } else {
            $response = $next($request);
        }

        if ($this->isApiRequest($request)) {
            $this->applyCorsHeaders($response, $origin);
        }

        return $response;
    }

    private function isApiRequest(Request $request): bool
    {
        $path = ltrim($request->path(), '/');

        return str_starts_with($path, 'api/') || str_starts_with($path, 'api') || $path === 'sanctum/csrf-cookie';
    }

    private function applyCorsHeaders(Response $response, ?string $origin): void
    {
        $allowOrigin = null;

        if ($origin && $this->isAllowedOrigin($origin)) {
            $allowOrigin = $origin;
        } elseif (filter_var(env('CORS_ALLOW_ALL', false), FILTER_VALIDATE_BOOL)) {
            $allowOrigin = $origin ?: '*';
        } elseif ($origin && app()->environment('production')) {
            // Bearer-token API: reflect Firebase / local dev origins in production
            $allowOrigin = $origin;
        }

        if (!$allowOrigin) {
            return;
        }

        $response->headers->set('Access-Control-Allow-Origin', $allowOrigin);
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
        $response->headers->set('Access-Control-Max-Age', '86400');
        $response->headers->set('Vary', 'Origin', false);
    }

    private function isAllowedOrigin(string $origin): bool
    {
        if (filter_var(env('CORS_ALLOW_ALL', false), FILTER_VALIDATE_BOOL)) {
            return true;
        }

        $allowed = array_filter(array_map(
            'trim',
            explode(',', (string) env(
                'CORS_ALLOWED_ORIGINS',
                'http://localhost:3000,http://localhost:8000,https://chat-bot-fe49e.web.app,https://chat-bot-fe49e.firebaseapp.com'
            ))
        ));

        if (in_array($origin, $allowed, true)) {
            return true;
        }

        $patterns = [
            '#^https://[a-z0-9-]+\.web\.app$#i',
            '#^https://[a-z0-9-]+\.firebaseapp\.com$#i',
            '#^http://localhost(:\d+)?$#i',
            '#^http://127\.0\.0\.1(:\d+)?$#i',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $origin) === 1) {
                return true;
            }
        }

        return false;
    }
}
