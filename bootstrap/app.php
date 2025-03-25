<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Exceptions\Handler;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__."/../routes/web.php",
        api: __DIR__."/../routes/api.php",
        commands: __DIR__."/../routes/console.php",
        health: "/up",
        apiPrefix: "/api",
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->dontReport([
            //
        ]);
        
        $exceptions->reportable(function (\Throwable $e) {
            //
        });

        $exceptions->renderable(function (\Throwable $e) {
            $handler = app()->make(Handler::class);
            return $handler->render(request(), $e);
        });
    })
    ->create();
