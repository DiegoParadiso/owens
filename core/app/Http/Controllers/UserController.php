<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{


    public function login()
    {
        return view('auth.login');
    }


    public function loginCheck(Request $request)
    {
        $validate = $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);

        if (Auth::attempt($validate)) {
            $request->session()->regenerate();
            return redirect()->intended('/dashboard');
        } else {
            return back()->with('error', 'Error al iniciar sesión, nombre de usuario o contraseña inválidos');
        }
    }

    public function logout(){
        Auth::logout();
        return redirect()->route('login')->with('success', 'Sesión cerrada con éxito');
    }
}
