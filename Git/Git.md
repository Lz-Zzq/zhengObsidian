#### git的操作方式

1.设置名称邮箱

![](https://cdn.nlark.com/yuque/0/2023/png/26515759/1678593942429-ca42da72-d06c-4d0e-938e-99a081b7f31a.png)

2.创建Github/Gitee 仓库

3.创建Git公钥,并且设置到Github/Gitee 文件地址C://Users/26600/.ssh/id_rsa

![](https://cdn.nlark.com/yuque/0/2023/png/26515759/1678594012725-476ed326-3fcf-4e83-9f03-652e888cfb24.png)

4.初始化本地仓库,将所有文件添加/提交到本地仓库
```
-- git init
```
```
-- git add .
```
```
-- git commit -m "提交注释"
```

5.关联远程仓库
```
-- git remote add origin git@xxxxxxx
```

6.上传文件
```
-- git push -u origin master   (-f强制推送)
```

7.远程推送
```
git push origin(远程名称) main(分支名称) 
```