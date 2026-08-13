/	顶级目录是根文件系统，它包含在挂载其他文件系统之前启动操作系统所需的所有文件，以及启动其他文件系统所需的文件。启动后，所有其他文件系统都作为根目录的子目录挂载在标准挂载点上。
/bin	包含基本命令的二进制文件。
/boot	由静态引导加载程序、内核可执行文件和启动 Linux 操作系统所需的文件组成。
/dev	包含设备文件，以便访问连接到系统的每个硬件设备。
/etc	本地系统配置文件。已安装应用程序的配置文件也可以保存在这里。
/home	系统上的每个用户在此都有一个子目录用于存储。
/lib	系统启动所需的共享库文件。
/media	外部可移动媒体设备（如 USB 驱动器）挂载在此处。
/mnt	常规文件系统的临时挂载点。
/opt	可选文件（如第三方工具）可以保存在这里。
/root	root 用户的主目录。
/sbin	此目录包含用于系统管理的执行文件（二进制系统文件）。
/tmp	操作系统和许多程序使用此目录来存储临时文件。此目录通常在系统启动时被清除，并可能在其他时间被删除，恕不另行通知。
/usr	包含可执行文件、库、man 文件等。
/var	此目录包含可变数据文件，如日志文件、电子邮件收件箱、Web 应用程序相关文件、cron 文件等。

pwd 当前路径
cat 查看文件
cp 复制
sudo root权限执行命令
adduser 添加用户
usermod 修改用户
userdel 删除用户
which 命令存在的路径位置
whoami 显示当前用户吗
rm 删除
sudo visodu 专门编辑 /etc/sudoers 文件 该文件管理用户组
groupadd 添加组
-a(append)G (group)
/etc/group 组数据
/etc/passwd 用户数据

gpasswd -d 用户 组 //从组中删除用户

### systemd
**systemd 是 Linux 系统的初始化系统（init 系统）+ 系统管理套件**
作用：内核启动完成后，**接管整个系统启动流程、管理所有服务、挂载磁盘、管理网络、日志、定时器、设备等**。
PID 1 就是systemd
systemd把所有管理对象叫做unit（单元）
```
.service：后台服务
.mount：磁盘挂载点
.timer：定时任务
.socket：网络套接字
```

### 守护进程
#### **守护进程（daemon）**：运行在后台、**不依附终端、不需要人工交互**的长期服务程序。
1. 没有控制台窗口，你关掉终端它不会退出；
2. 系统启动时自动运行，持续在后台待命；
3. 通常由 systemd /init 管理；
4. 不和任何终端（TTY）绑定。
#### 2. 守护进程标准特征（Linux）

1. 父进程一般是 `systemd(PID=1)`；
2. 脱离控制终端（无关联 tty）；
3. 工作目录通常切换到 `/`；
4. 标准输入、输出、错误重定向（一般定向到日志，不再打印终端）；
5. 会话组长、独立进程组。
例如：
- `sshd`：ssh 远程登录守护进程
- `systemd`：一号进程，系统守护进程
- `NetworkManager`：网络管理守护进程
- `rsyslog`：日志守护进程

```linux
sudo systemctl list-unit-files | grep nginx
sudo systemctl list-units --all | grep nginx
unit-fles：磁盘上存放的单元配置文件（xxx.service）同时展示状态
list-units：units=systemd 当前内存中加载的单元实例，只列出被加载到内存中的
```
