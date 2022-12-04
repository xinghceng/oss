# oss
``` 序列化 反序列化
 foreach($res as $k=>$v){
            $res[$k]['img']=unserialize($v['img']);
        }
 $img=serialize($image);
```
```请求三要素
//    请求成功
   public static function success($code,$message,$data)
   {
      return json_encode(['code'=>$code,'message'=>$message,'data'=>$data]);
   }
//   请求失败
   public static function fail($code,$message,$data)
   {
     return json_encode(['code'=>$code,'message'=>$message,'data'=>$data]);
   }
```
``` 递归
   public function get_tree_list($data,$pid=0)
    {
        $arr=[];
        foreach ($data as $v){
            if (($pid == $v['pid'])){
//            递归
                $v['son'] = $this->get_tree_list($data,$v['id']);
                $arr[]=$v;
            }
        }
        return $arr;
}
```
``` 
 /**
     * 多图片云存储 防盗链
     *
     *
     */
    public function getImage(Resquest $resquest)
    {
//        dd(1);
        $file=$_FILES;
        // 要上传文件的本地路径
        $filePath=$file['image']['tmp_name'];
        if (!$file)
        {
            return Resquest::fail(4001,'错误实例',[]);
        }
// 需要填写你的 Access Key 和 Secret Key
        $fileName=mt_rand(1111,9999).'jpg';
        $accessKey ="ZaNQA651RMh49VZ4dh5w7DMonBaDPw5Wp4tyITUe";
        $secretKey = "UT59YbeYjVKrtaPsfl6sGOJGwgtLNAfDpeuL_3gx";
        $bucket = "shihao7";
        // 构建鉴权对象
        $auth = new Auth($accessKey, $secretKey);
        // 生成上传 Token
        $token = $auth->uploadToken($bucket);
        // 分片上传可指定 version 字段，v2 表示使用分片上传 v2 , v1 表示 分片上传 v1 (默认 v1) , 选择 v2 可自定义分片大小，此处设为 6 MB，默认 4 MB
        $version = 'v2';
        $partSize = 6 * 1024 * 1024;
        // 初始化 UploadManager 对象并进行文件的上传。
        $uploadMgr = new UploadManager();
        // 调用 UploadManager 的 putFile 方法进行文件的上传。
        list($ret, $err) = $uploadMgr->putFile(
            $token,
            $fileName,
            $filePath,
            null,
            '',
            false,
            $version,
            $partSize
        );
        //        图片链接
        $imgLink="http://rm76ewape.hn-bkt.clouddn.com/".$fileName.'/a';
        if ($imgLink != null) {
            return ['code'=>200,'msg'=>'上传成功','data'=>$imgLink];
        } else {
            return  ['code'=>201,'msg'=>'上传失败','data'=>[]];
        }
    }
```
```断网
wx.onNetworkStatusChange((res) => {
    	//取反满足条件,跳转已经写好的网络异常页面
        if(!res.isConnected){
            wx.navigateTo({
              url: '/pages/index/error',
            })
        }
    })
```
```防跨域
  public function handle(Request $request, Closure $next)
    {
        $response=$next($request);
        $origin = $request->server('HTTP_ORIGIN') ? $request->server('HTTP_ORIGIN') : '';
        $allow_origin = [
            'http://localhost:8000',
        ];
        if(in_array($origin,$allow_origin)){
            $response->header('Access-Control-Allow-Origin', $origin);
            $response->header('Access-Control-Allow-Headers', 'Origin, Content-Type, Cookie, X-CSRF-TOKEN, Accept, Authorization, X-XSRF-TOKEN');
            $response->header('Access-Control-Expose-Headers', 'Authorization, authenticated');
            $response->header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, OPTIONS');
            $response->header('Access-Control-Allow-Credentials', 'true');
 
        }
        return $next($request);
    }
```
```
public function getForm(Request $request)
{
    $text_id=$request->input('text_id');
    if (!$text_id)
    {
        return Resquest::fail(4001,'文章id错误',[]);
    }
    $token=$request->input('token');
    if (!$token)
    {
        return  Resquest::fail(4001,'token不正确',[]);
    }
    $comment=$request->input('comment');
    //  评论审核
//    $appId = "26444078";
//    $apiKey = "5VMKnYoqALchi9dnEaeHXkSf";
//    $secretKey = "XrDAsRf6pgsIksxaBjoBBrKGPQxkqYcq";

//    $client = new \Luffy\TextCensor\Core($appId, $apiKey, $secretKey);
//    $res = $client->textCensorUserDefined($comment); //待审核文本字符串
////    var_dump($res);
//    if ($res['conclusion'] == '不合规'){
//        return json_encode([
//            'code'=>4001,
//            'msg'=>'success',
//            'data'=>$res['data']['0']['msg']
//        ]);
//    }
    $jwt=(new  JwtService())->getToken($token);
//    获取用户id
    $user_id=$jwt->uid;
    if (!$comment)
    {
        return  Resquest::fail(4001,'评论信息获取错误',[]);
    }
    $data=[
      'text_id'=>$text_id,
      'user_id'=>$user_id,
      'comment'=>$comment,
        'pid'=>0,
        'status'=>1
    ];
    $res=Comment::with('user')->create($data);
    if($res)
    {
        $comment=Comment::with('user')->where('id',$res['id'])->first();
//        dd($comment);
        event(new PodcastProcessed($comment));
        return Resquest::success(200,'发布成功',$comment);
    }else{
        return Resquest::fail(4001,'发布失败',[]);
    }
}
```
```
public function getReport(Request $request)
{
//    获取拼论id
   $text_id=$request->input('text_id');
   if (!$text_id)
   {
       return Resquest::fail(4001,'用户id未获取',[]);
   }
//   获取pid
    $pid=$request->input('pid');
   if (!$pid)
   {
       return Resquest::fail(4001,'实收东西',[]);
   };
   $token=$request->input('token');
   if (!$token)
   {
       return  Resquest::fail(4001,'token不正确',[]);
   }
   $jwt=(new JwtService())->getToken($token);
   $user_id=$jwt->uid;
   if (!$user_id)
   {
       return Resquest::fail(4001,'用户未登录信息错误');
   }
   $comment=$request->input('comment');
   if (!$comment)
   {
       return Resquest::fail(4001,['评论未获取'],[]);
   }
   $data=[
     'user_id'=>$user_id,
     'text_id'=>$text_id,
     'pid'=>$pid,
     'comment'=>$comment,
     'status'=>1
   ];
   $res=Comment::create($data);
   if ($res)
   {
       $comment=Comment::with('user')->where('id',$res['id'])->first();
//        dd($comment);
       event(new PodcastProcessed($comment));
       return Resquest::success(200,'回复成功',$res);
   }else{
       return Resquest::fail(4001,'回复失败',[]);
   }
}
```