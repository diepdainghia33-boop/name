<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApiKeyController extends Controller
{
    public function index()
    {
        $tokens = Auth::user()->tokens()->orderBy('created_at', 'desc')->get();
        
        return response()->json($tokens->map(function ($token) {
            return [
                'id' => $token->id,
                'name' => $token->name,
                'key' => '********************', // Masked for security
                'createdAt' => $token->created_at->toDateString(),
                'lastUsed' => $token->last_used_at ? $token->last_used_at->diffForHumans() : 'Never',
                'permissions' => $token->abilities,
                'active' => true
            ];
        }));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'required|array'
        ]);

        $token = Auth::user()->createToken($request->name, $request->permissions);

        return response()->json([
            'id' => $token->accessToken->id,
            'name' => $token->accessToken->name,
            'key' => $token->plainTextToken,
            'createdAt' => $token->accessToken->created_at->toDateString(),
            'lastUsed' => 'Never',
            'permissions' => $token->accessToken->abilities,
            'active' => true
        ]);
    }

    public function destroy($id)
    {
        Auth::user()->tokens()->where('id', $id)->delete();
        return response()->json(['message' => 'API Key deleted successfully']);
    }
}
