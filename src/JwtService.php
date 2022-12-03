<?php


namespace App\Services;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;

class JwtService
{
    /**
     * Author：刘鹏勇
     * date：2022/11/28
     * time：15:40
     * jwt
     */
    public function setToken($uid)
    {

        $key = 'example_key';
        $payload = [
            'iss' => 'http://example.org',
            'aud' => 'http://example.com',
            'iat' => 1356999524,
            'nbf' => 1357000000,
            'uid'=>$uid
        ];
        return $jwt = JWT::encode($payload, $key, 'HS256');
    }
    /**
     * Author：刘鹏勇
     * date：2022/11/28
     * time：16:15
     * @param Request $request
     * 解析token
     */
    public function getToken($jwt)
    {
        $key = 'example_key';
        return $decoded = JWT::decode($jwt, new Key($key, 'HS256'));
    }
}
