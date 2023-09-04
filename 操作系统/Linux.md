### 1. 网络的三种模式
- 1  桥接网络模式
	桥接网络是指本地物理网卡和虚拟网卡通过VMnet0虚拟交换机进行桥接，物理网卡和虚拟网卡在拓扑图上处于同等地位(虚拟网卡既不是Adepter VMnet1也不是Adepter VMnet8)。
	这里的VMnet0相当于一个交换机，最终通过这个虚拟交换机使其两端在一个网段中。
	![](https://img-blog.csdn.net/20130811160406093)  
	那么物理网卡和虚拟网卡就相当于处于同一个网段，虚拟交换机就相当于一台现实网络中的交换机。所以两个网卡的IP地址也要设置为同一网段。
	如果使虚拟机使用桥接模式连接网络，在运行cmd命令后产看两个IP，可以发现IPv4的IP 和虚拟机处于一个网段。
	物理网卡和虚拟网卡的IP地址处于同一个网段，子网掩码、网关、DNS等参数都相同。两个网卡在拓扑结构中是相对独立的。
	桥接网络模式是VMware虚拟机中最简单直接的模式。安装虚拟机时它为默认选项。
	在桥接模式下，虚拟机和宿主计算机处于同等地位，虚拟机就像是一台真实主机一样存在于局域网中。因此在桥接模式下，我们就要像对待其他真实计算机一样为其配置IP、网关、子网掩码等等。
	当我们可以自由分配局域网IP时，使用桥接模式就可以虚拟出一台真实存在的主机。
- 2  NAT模式
	在NAT网络中，会用到VMware [Network](http://whatis.ctocio.com.cn/searchwhatis/367/6093367.shtml) Adepter VMnet8虚拟网卡，主机上的VMware Network Adepter VMnet8虚拟网卡被直接连接到VMnet8虚拟交换机上与虚拟网卡进行通信。
	VMware Network Adepter VMnet8虚拟网卡的作用仅限于和VMnet8网段进行通信，它不给VMnet8网段提供路由功能，所以虚拟机虚拟一个NAT服务器，使虚拟网卡可以连接到Internet。在这种情况下，我们就可以使用端口映射功能，让访问主机[80](http://whatis.ctocio.com.cn/searchwhatis/293/5949293.shtml)端口的请求映射到虚拟机的80端口上。
	VMware Network Adepter VMnet8虚拟网卡的IP地址是在安装VMware时由系统指定生成的，我们不要修改这个数值，否则会使主机和虚拟机无法通信。
	![](https://img-blog.csdn.net/20130811160327781)  
	虚拟出来的网段和NAT模式虚拟网卡的网段是一样的，都为192.168.111.X，包括NAT服务器的IP地址也是这个网段。在安装VMware之后同样会生成一个虚拟DHCP服务器，为NAT服务器分配IP地址。
	当主机和虚拟机进行通信的时候就会调用VMware Network Adepter VMnet8虚拟网卡，因为他们都在一个网段，所以通信就不成问题了。
	实际上，VMware Network Adepter VMnet8虚拟网卡的作用就是为主机和虚拟机的通信提供一个接口，即使主机的物理网卡被关闭，虚拟机仍然可以连接到Internet，但是主机和虚拟机之间就不能互访了。
	在NAT模式下，宿主计算机相当于一台开启了DHCP功能的 [路由器](http://www.2cto.com/net/router/)，而虚拟机则是内网中的一台真实主机，通过路由器(宿主计算机)DHCP动态获得网络参数。因此在NAT模式下，虚拟机可以访问外部网络，反之则不行，因为虚拟机属于内网。
	使用NAT模式的方便之处在于，我们不需要做任何网络设置，只要宿主计算机可以连接到外部网络，虚拟机也可以。
	NAT模式通常也是大学校园网Vmware最普遍采用的连接模式，因为我们一般只能拥有一个外部IP。很显然，在这种情况下，非常适合使用NAT模式。
- 3  Host-only模式
    在Host-Only模式下，虚拟网络是一个全封闭的网络，它唯一能够访问的就是主机。其实Host-Only网络和NAT网络很相似，不同的地方就是 Host-Only网络没有NAT服务，所以虚拟网络不能连接到Internet。主机和虚拟机之间的通信是通过VMware [Network](http://whatis.ctocio.com.cn/searchwhatis/367/6093367.shtml) Adepter VMnet1虚拟网卡来实现的。
	![](https://img-blog.csdn.net/20130811160553656)  
	同NAT一样，VMware Network Adepter VMnet1虚拟网卡的IP地址也是VMware系统指定的，同时生成的虚拟DHCP服务器和虚拟网卡的IP地址位于同一网段，但和物理网卡的IP地址不在同一网段。
	Host-Only的宗旨就是建立一个与外界隔绝的内部网络，来提高内网的安全性。这个功能或许对普通用户来说没有多大意义，但大型服务商会常常利用这个功能。如果你想为VMnet1网段提供路由功能，那就需要使用RRAS，而不能使用XP或2000的ICS，因为ICS会把内网的IP地址改为 192.168.0.1，但虚拟机是不会给VMnet1虚拟网卡分配这个地址的，那么主机和虚拟机之间就不能通信了。
	在Host-only模式下，相当于虚拟机通过双绞线和宿主计算机直连，而宿主计算机不提供任何路由服务。因此在Host-only模式下，虚拟机可以和宿主计算机互相访问，但是虚拟机无法访问外部网络。
	当我们要组成一个与物理网络相隔离的虚拟网络时，无疑非常适合使用Host-only模式。
```
设置网络  vim /etc/sysconfig/network-scripts/ifcfg-ens33  
TYPE="Ethernet"
BOOTPROTO="static"
DEVICE="ens33"
ONBOOT="yes"
IPADDR="192.168.xxx.xxx"
NETMASK="255.255.255.0"
GATEWAY="192.168.0.1"
DNS1="8.8.8.8"

systemctl restart network
```
### 2. 目录结构
```
1)  linux 的文件系统是采用级层式的树状目录结构，在此结构中的最上层是根目录“/”，然后在此目录下再创建其他的
目录。
2)  深刻理解 linux 树状文件目录是非常重要的，这里我给大家说明一下。
3)  记住一句经典的话：在 Linux 世界里，一切皆文件(!!)

4.2
具体的目录结构(不用背,知道即可)
1) /bin [常用]
	(/usr/bin 、 /usr/local/bin)
	是 Binary 的缩写, 这个目录存放着最经常使用的命令
2) /sbin
	(/usr/sbin 、 /usr/local/sbin)
	s 就是 Super User 的意思，这里存放的是系统管理员使用的系统管理程序。
3)
	/home [常用]
	存放普通用户的主目录
```
![[Pasted image 20230703220424.png|500]]
### 3. 用户管理
```
设置用户名
	useradd  [name]
默认地址  /home/name  指定目录 useradd -d address name
设置密码
	passwd [name]
查看当前用户
	whoami / who am i
用户组   类似角色,系统可以对有共性用户进行统一管理
新增组
	groupdel [name]
	useradd -g [用户组][name]  添加用户直接添加到组中
删除组
	groupdel [name]
用户和组相关文件
/etc/passwd 文件
	用户(user) 的配置文件,记录用户的各种信息
	每行的含义: 用户名:口令:用户标识号:注释行描述:主目录:登陆Shell
/etc/shadow 文件
	口令的配置文件
	每行的含义: 登录名:加密口令:最后一次修改时间:最小时间间隔:最大时间间隔:警告时间:不活动时间:失效时间:标志
/etc/group 文件
	组(group)的配置文件,记录Linux 包含的组的信息
	每行含义: 组名:口令:组标识号:组内用户列表
```
### 4. 实用指令
#### 4.1 运行级别
```
级别
	0 关机
	1 单用户[找回丢失的密码]
	2 多用户状态没有网络服务
	3 多用户状态有网络服务
	4 系统未使用保留给用户
	5 图形界面
	6 系统重启
指令
	init [0-6] 切换不同的运行级别
CentOS7以前是存放在/etc/inittab文件中
	multi-user.target: analogous to runlevel 3  [multi-user多用户]  
	graphical.target: analogous to runlevel 5 
设置/查看级别
	systemctl get-default 当前级别  
	systemctl set-default TARGET.target   [multi-user] and [graphical] ...
```
#### 4.2 找回密码
```
重启 进入选择系统界面输入E
光标下移 找到linux_16这一行的最后  输入 init=/bin/sh   
随后Ctrl+x进入单用户模式
输入: mount -o remount,rw /
输入: passwd
12345
12345
输入 touch / .autorelabel
输入 exec /sbin/init
```
#### 4.3 帮助指令
```
man 获得帮助信息
	man [命令或者配置文件]   man ls
help
	help 命令
```
#### 4.4 文件目录
```
	**pwd    绝对路径    
	**mkdir [ -p 多级目录] 创建目录
	**rmdir  要删除的空目录
	**touch 创建文件
	**cp [ -r 整个文件夹] source dest  拷贝  \cp 强制覆盖
	**rm [-r递归删除文件夹  -f强制删除不提示]  要删除的文件或者目录
	**mv 移动文件或者目录或者重命名  mv old new  文件重命名  mv/a/b.txt  /d/a.txt  移动并重命名
	**cat [-n显示行号] 查看文件内容  一般配合管道命令 | more  (分页)
	**more 基于VI编辑器的文本过滤器 全屏幕方式按页显示文本文件内容.more指令中内置了若干快捷键
		空白键 代表翻页   enter翻页一行  q离开more名且不显示 ctrl F 向下滚动一屏 ctrl B 返回上一屏  = 输出当前行号  :f输出文件名和当前行的行号
	**less 用来分屏查看文件内容 对于more有更高的效率 一次不是加载所有内容
		pagedown下一页   pageup上一页   /字串 搜索 n下查找N上查找  ?字串  n上查找 N下查找  q exit
	**echo 指令  输入内容到控制台
	**head [-n 5 查看五行数字]用于显示文件开头部分内容  默认显示文件前面10行内容 
	**tail [-n 5   -f实时追踪文档所有更新] 输入文件尾部内容 默认查看后10行
	**> 指令与 >>
		> 输出重定向 >>追加
		ls -l > file  覆盖  
		ls -al >> file 追加末尾
		cat file1 > file2 1覆盖2
		echo txt >> file  追加
	**ln 软链接 符号链接 类似于快捷方式
		ln -s [源文件或目录] [软链接名]  _当我们使用pwd查看目录,仍旧是软连接所在的目录_
	**history [10]  查看历史命令
	**date 时间日期
		date [-s 字符串时间]  显示当前时间
		date +%Y 年份
		date +%m 月份
		date +%d 天
		date "+%Y-%m-%d %H:%M:%S"  年月日时分秒
	**cal 查看日历 
	**find 指令
		find [-name 按照名称 user用户名 size文件大小 搜索范围] find指令将从指定目录向下递归遍历各个子目录,将满足条件的文件在终端显示
	**locate
		locate 搜索文件  可以快速定位文件路径  使用之前需要执行updatedb指令
	**which 
		可以查看指令存在的目录
	**grep指令 管道符号 |
		grep [选项 -n显示行号  -i忽略大小写] 查找内容 源文件      grep过滤查找 管道符| 表示将一个命令处理结果交给后面指令处理
	**gzip/gunzip 压缩/解压
		gzip file  压缩为.gz文件
		gunzip file.gz 解压缩文件
	**zip/unzip 压缩/解压
		zip [-r 递归压缩 ] file.zip 
		unzip [-d 指定压缩后存放的目录]
	**tar指令 打包指令,最后打包后的文件是.tar.gz文件
		tar [-c 产生.tar打包文件 -v显示详细信息 -f指定压缩后的文件名  -z打包同时压缩 -x解包.tar文件] xxx.tar.gz 打包的内容  -C 选择解压的位置
	**ls -ahl 查看所有文件的所有者
		chown 用户名 文件名 修改文件所有者
	**chgrp  修改文件所在的组
		chgrp 组名 文件名
	**改变用户所在组
		usermod -g 新组名 用户名
		usermod -d 目录名 用户名 改变用户登陆的初始目录  用户需要有进入到新目录的权限
	
```
### 5. 权限
```
**ls -l 中显示的内容
**-rwxrw-r 1 root root 1213 Feb 2 09:30 abc
**0-9位说明    字母可以用数字表示  r=4 w=2 x=1 
	1.第零位确定文件的类型(d,-,l,c,b)
		- 普通文件
		l 是链接,相当于windows中的快捷方式
		d 是目录,相当于windows的文件夹
		c 是字符设备文件,鼠标,键盘
		b 是块设备,比如硬盘
	2.第1-3位确定所有者(**该文件的所有者**)拥有该文件的权限 --User
		r  可读 
		w 可写
		x  可执行  作用到目录代表可进入
	3.第4-6位确定所属组(**同用户组的**)拥有该文件的权限 --Group
		r  可读
		w 可写
		x 可执行
	4.第7-9位确定其他用户拥有该文件的权限 --Ohter
		同上
	5.后面的数字1 
		文件: 硬连接数
		目录: 子目录数
** chmod 指令 修改文件目录的权限
	第一种方式: + - = 变更权限
	u 所有者  
	g 所有组
	o 其他人
	a 所有人(ugo总和)
	chmod u=rwx,g=rx,o=x 文件/目录名
	chmod o+w 文件/目录名
	chmod a-x 文件
** 修改文件所有者
	chown newowner 文件/目录 改变所有者
	chown newowner:newgroup 文件/目录 改变所有者和所在组
	-R 如果是目录 则使其下所有子文件或目录递归生效
**  修改文件所在组
	chgrp newgroup 文件/目录 [改变所在组]

```
### 6.任务调度
```
** crontab 进行定时任务调度
	crontab [-e l r]
		e: 编辑crontab定时任务
		l : 查询crontab任务
		r : 删除当前所有的crontab任务
		例 : */1 * * * * ls -l /etc/ > /tmp/to.txt   每分钟执行一次 ls -l /etc/ > /tmp/to.txt命令
	符号说明
		* 代表任何时间,比如第一个 "*" 就代表一小时中每分钟都执行了一次的意思
		, 代表不连续的时间 比如 "0 8,12,16 * * *命令" ,就代表在每天的8点0分,12点0分,16点0分都执行一次命令
		- 代表连续的时间范围,比如 "0 5 * * 1-6命令",就代表在周一到周五的凌晨5点0分执行命令
		*/n 代表每隔多久执行一次,比如 "*/10 * * * *命令" ,代表每隔10分钟就执行一遍命令
	
```