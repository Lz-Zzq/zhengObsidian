worker_processes  2;     ---全局块 和Nginx运行相关的全局配置

events {                 ---events块 网络连接相关配置
    worker_connections  1024;
}

http {                   ---http块 代理,缓存,日志记录 虚拟主机地址
    include       mime.types;
    default_type  application/octet-stream;


    sendfile        on;

    keepalive_timeout  65;

        # upstream httpds{
        # server 192.168.31.136:80 weight=8 down;
        #server 192.168.31.137:80 weight=2;
        #}


    server {          ---Server块 
        listen       80;
        server_name  localhost;

    location / {		---location 块
            root   html;
            index  index.html index.htm;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

    }
# 负载均衡------------------------------------------------------------
        upstream targetserver{ # upstream指令可以定义一组服务器
                server 192.168.31.139:80 weight=8;
                server 192.168.31.138:80 weight=2;
        }


        server{
        listen  8080;
        server_name localhost;
        location / {
                proxy_pass http://targetserver;
        }

    }


# 反向代理 ----------------------------------------------------------------------

        server{
        listen 82;
        server_name localhost;
        location /{
                proxy_pass http://192.168.31.136:8080; # 反向代理配置,此请求转发到指定服务
        }
}

}


 安装过程
     1.安装依赖包 yum -y install gcc pcre-devel zlib-devel openssl openssl-devel
     2.yum install wget  wget https://nginx.org/download/nginx-1.16.1.tar.gz
     3.tar -zxvf nginx.....
     4.cd nginx..
     5. ./confgure --refix=/usr/local/nginx    --提前创建
     6.make && make install 编译之后安装
  目录:
    conf/nginx.conf			nginx配置文件
    html					存放静态文件(html,css,js)等
    logs					日志
    sbin/nginx				二进制文件,启动and停止
  nginx命令:
    ./nginx -t 检查配置文件是否错误  -v查看版本
    ./nginx 启动  -s stop 停止
    ./nginx -s reload  重新加载
  如果向全局访问,则进入 /ect/profile文件中配置
  PATH=/usr/local/nginx/sbin:$JAVA_HOME/bin:$PATH
  随后 source /ect/profile 重新加载文件 
  
  

负载均衡策略
默认轮询方式
weight			权重方式
ip_hash			根据ip分配方式
least_conn		依据最少连接方式
url_hash		依据url分配方式
fair			依据响应时间方式



启动Nginx:  service nginx start
停止Nginx:  nginx -s stop
平滑启动nginx
nginx -s reload:  平滑启动的意思是在不停止nginx的情况下，重启nginx，重新加载配置文件，启动新的工作线程，完美停止旧的工作线程。
加载指定配置文件启动nginx:        /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf


查看帮助信息	nginx -h
查看nginx版本(小写字母v)	nginx -v

除版本信息外还显示配置参数信息(大写字母V)	nginx -V
指定配置文件启动	nginx   start nginx -c filename

关闭nginx，完整有序的停止nginx，保存相关信息  	nginx -s quit

重新载入nginx，当配置信息修改需要重新加载配置是使用 	  nginx -s reload

重新打开日志文件 	 nginx -s reopen

测试nginx配置文件是否正确 	   nginx -t -c filename