<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\RedirectIfAuthenticated;
use Illuminate\Routing\Redirector;

class RedirectIfAuthenticated extends RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     */
    public function handle($request, $next, ...$guards)
    {
        return parent::handle($request, $next, ...$guards);
    }
}
