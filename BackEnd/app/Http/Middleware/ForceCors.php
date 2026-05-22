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

        if ($this->isApiRequest($request) && $origin) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
            $response->headers->set('Access-Control-Max-Age', '86400');
            $response->headers->set('Vary', 'Origin', false);
        }

        return $response;
    }

    private function isApiRequest(Request $request): bool
    {
        $path = ltrim($request->path(), '/');

        return str_starts_with($path, 'api/') || $path === 'sanctum/csrf-cookie';
    }
}
