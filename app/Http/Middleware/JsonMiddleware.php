<?php
// app/Http/Middleware/JsonMiddleware.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class JsonMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        Log::info('JsonMiddleware handle method called');
        // Force JSON response for API requests
        $request->headers->set('Accept', 'application/json');

        // Process the request
        $response = $next($request);

        // If the response is not already an instance of Response, convert it
        if (!$response instanceof Response) {
            $response = response()->json(['data' => $response]);
        }

        // Force content type to be JSON
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }
}
