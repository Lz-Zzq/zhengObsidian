### 1.网络的三种模式
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
### 2.目录结构
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
### 3.用户管理
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
### 4.实用指令
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
	**find 查找指令
		find [-name 按照名称 user用户名 size文件大小 搜索范围] find指令将从指定目录向下递归遍历各个子目录,将满足条件的文件在终端显示
	**locate  查找
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
### 5.权限
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
		如果需要脚本,则先写脚本,随后添加权限,最后编写定时任务调度
		第一代表 一小时当中第几分钟  0-59
		第二代表 一天当中的第几小时 0-23
		第三代表 一个月当中的第几天 1-31
		第四代表 一年当中的地几个月 1-12
		第五代表 一周当中的星期几 0-7   0与7都是周日
	符号说明
		* 代表任何时间,比如第一个 "*" 就代表一小时中每分钟都执行了一次的意思
		, 代表不连续的时间 比如 "0 8,12,16 * * *命令" ,就代表在每天的8点0分,12点0分,16点0分都执行一次命令
		- 代表连续的时间范围,比如 "0 5 * * 1-6命令",就代表在周一到周五的凌晨5点0分执行命令
		*/n 代表每隔多久执行一次,比如 "*/10 * * * *命令" ,代表每隔10分钟就执行一遍命令
	例: 
		*10 4 * * *  每天凌晨四点每隔10分执行一次
		0 0 1,15 * 1 每月1号15号,并且是每周1的0.00开始执行   最好不要这么写
	crontab -r 终止任务调度
	crontab -l 列出任务调度
	service crond restart 重启任务调度
** at 定时任务 一次执行的定时计划任务  执行一个任务之后就不会在执行此任务了
	at [选项] [时间]    Ctrl + D 结束at命令的输入  
		atd守护进程每隔60s会检查系统中的一个特殊目录来获取at提交的作业 时间匹配则会执行作业
	选项
		-m 指定的任务被完成后,将给用户发送邮件,即使没有标准输出
		-I atq的别名
		-d atrm的别名
		-v 显示任务将被执行的时间
		-c 打印任务的内容到标准输出
		-V 显示版本信息
		-q <队列> 使用指定的队列
		-f <文件> 从指定文件读入任务而不是从标准输入读入
		-t <时间参数> 以时间参数的形式提交药运行的任务
		小提示 : ps -ef | grep atd 检测当前正在执行的进程  检测atd是否正在运行 
	at 指定时间
		1.接收当天的时间,如果时间过去了就在第二天执行
		2.使用midnight(深夜),noon(中午),teatimer(喝茶时间 4.00) 比较模糊的词语来指定时间
		3.采用12小时计时制度,需要在时间后面家伙是那个AM(上午)或者PM(下午)
		4.指定命令执行的具体日期,指定格式为month day (月 日) 或mm/dd/yy (月/日/年) dd.mm.yy (日/月/年) 指定的日期必须跟在指定时间的后面
		5.相对计时,格式: now + count(数字) time-units
			now就是当前时间
			count 数字
			time-units是时间单位     这里可以是 minutes分钟 hours小时 days天 weeks星期
		6.直接使用today 今天 tomorrow 明天
	atq 查询任务
	atrm 删除任务
```
### 7.Linux分区
```
原理介绍
	1. Linux归根结底只有一个目录,独立唯一的文件结构
	2. Linux采用了一种"载入"的处理方法,整个文件系统中包含了一整套的文件和目录,且将一个分区与一个目录联系起来
	这时要载入的一个分区使它的存储空间在一个目录下获得
** lsblk / lsblk-f
	显示分区情况
硬盘说明
	1.Linux硬盘分IDE硬盘和SCSI硬盘,目前基本SCSI
	2.对于IDE硬盘,驱动标识符 "hdx~" hd表示分区设备的类型,指的是IDE硬盘了,x盘号 (a基本盘,b基本从属盘,c辅助主盘,d辅助从属盘) ~ 代表分区,
	前四个分区用数字1-4表示,他们是主分区或扩展分区,从5开始就是逻辑分区
	例: hda3表示为第一个IDE硬盘上的第三个主分区或者扩展分区,hdb2表示为第二个IDE硬盘上的第二个主分区或扩展分区
	3.对于SCSI硬盘标识为 sdx~,SCSI硬盘是用 sd 来表示分区所在设备的类型,其余则同上
** fdisk  /dev/sdb  分区命令
	开始对 /sdb分区
	m 显示命令列表
	p 显示磁盘分区 同 fdisk -l
	n 新增分区
	d 删除分区
	w 写入并退出
	说明: 开始分区后输入n,新增分区,然后选择p,分区类型为主分区.两次回车默认剩余全部空间,最后输入w写入分区并退出,若不保存退出输入q
** mkfs -t ext4 /dev/sdb1   格式化磁盘
	挂载: 将一个分区与一个目录联系起来
	mount  设备名称 挂载目录   mount /dev/sdb1  /newdisk
	umount 设备名称 / 挂载目录    umount  /dev/sdb1 或者  umount  /newdisk  卸载
	注意:  命令行挂载重启后会失效
	永久挂载: 通过修改/etc/fstab实现挂载  添加完成后执行mount -a即可生效
	/dev/sdb1     /newdisk     ext4    defaults  0 0
** df -h
	查询系统整体磁盘使用情况 
** du -h /目录
	查询指定目录的磁盘占用情况
	-s 指定目录占用大小汇总
	-h 带计量单位 
	-a 包含文件
	--max-depth=1 子目录深度
	-c 列出明细的同时,增加汇总值
	
	例: 列出opt文件夹下的文件个数   (^d 代表目录  - 代表文件个数)
	ls -l /opt | grep "^-" | wc -l
	列出opt文件夹下的文件与子文件个数  (^d 代表目录  - 代表文件个数)
	ls -lR /opt | grep "^-" | wc -l
```
### 8.网络配置
#### NTA网络模式
![[Pasted image 20230908103936.png | 500]]
#### 指定网络IP方法

修改配置文件来指定IP,并可以连接到外网

VMnet1
>这是一个VMware Workstation中默认的虚拟网络,通常用于主机和虚拟机之间的Host-Only网络连接。这意味着只有主机和其上的虚拟机之间可以相互通信，而无法访问外部网络，如互联网。

VMnet8
>这是另一个VMware Workstation默认的虚拟网络,通常被用作NAT（Network Address Translation）网络。这允许虚拟机能够共享主机系统的IP地址，并通过主机系统访问外部网络，如互联网。

```
查看vm8的网关 子网掩码
	vim  /etc/systemctl/network-scripts/ifcfg-ens33
	---------------------------------------------------
	UUID=""    //随机id
	HWADDR="00:0c:2x...."  //MAC地址
	TYPE="Ethernet"     //网络类型  通常是ethemet
	BOOTPROTO="static"      //IP配置方法  none  static bootp dhcp  (引导时不使用协议|静态分配IP|BOOTTP协议|DHCP协议)  
	DEVICE="ens33"    //接口名 设备/网卡
	ONBOOT="yes"     //新系统启动时候网络接口是否有效   yes/no
	IPADDR="192.168.253.253"         //IP地址
	NETMASK="255.255.255.0"        //子网掩码     
	GATEWAY="192.168.253.2"       //网关  vm8
	DNS1="8.8.8.8"          //域名解析器
	DNS2="8.8.4.4"
	--------------------------------------------------
	reboot  / service network restart
```
#### 设置主机名和hosts映射

windows
>C:\Windwos\System32\drivers\etc\hosts 
>111.111.111.111  [name]

linux
>/etc/hosts 
>111.111.111.111 [name]

Hostst是什么
>一个文本文件,用来记录IP和Hostname(主机名)的映射关系

DNS
>DNS,就是Domain Name System的缩写,翻译过来就是域名系统
>就是互联网上作为域名和IP地址相互映射的一个分布式数据库

输入www.baidu.com
>1.浏览器会先检查浏览器缓存中有没有该域名解析IP,有就先调用,没有就检查DNS解析器缓存,如果有就返回IP完成解析.可以理解为本地解析器缓存
>2.如果本地解析器缓存没有找到对应映射,检查系统中hosts文件中有没有配置对应的域名IP映射,如果有返回
>3.如果本地DNS解析器缓存和hosts文件中没有对应IP,则到域名服务器解析
>>pconfig /displaydns  //DNS域名解析缓存
>>pconfig /flushdns   //手动清理DNS缓存

#### 防火墙

ifconfig 查看linux的ip地址
- systemctl status firewalld , firewall-cmd --state
>查看防火墙状态

- systemctl stop firewalld
>关闭防火墙

- systemctl disable firewalld
>永久关闭防火墙

- systemctl stop firewalld.service
>关闭防火墙

- systemctl start firewalld
>开启防火墙

- 开放指定端口  
>firewall-cmd --zone=public --add-port=8080/tcp --permanent)

- 关闭指定端口  
>firewall-cmd --zone=public --remove-port=8080/tcp --permanent)

- 立即成效  
>firewall-cmd --reload

- 查看开放端口  
>firewall-cmd --zone=public --list-ports

systemctl 是管理linux中服务的命令，可以对服务进行启动，停止，重新启动，查看状态等操作
firewall-cmd是Linux中专门用于控制防火墙的命令

### 9.进程
#### 进程详情
1. 在Linux中,每个执行的程序都称为一个进程,每一个进程都分配一个ID号(PID,进程号)
2. 每个进程都可能存在两种方式存在,前台与后台,所谓前台进程就是用户目前的屏幕上可以进行操作的.后台进程则是实际操作,由于屏幕上无法看到的进程,通常使用后台方式执行.
3. 一般系统的服务都是以后台进程方式存在,而且都会常驻在系统中,直到关机才结束
#### 显示系统执行的进程

- ps 命令用来查看目前系统中,有哪些正在执行,以及他们执行的状况.可以不加任何参数.
>ps显示信息选项
>>PID 进程识别号
>>TTY 终端机号
>>TIME 此进程所消CPU时间
>>CMD 正在执行的命令或进程
>>ps -a  显示当前终端所有进程信息
>>ps -u 以用户的格式显示进程信息
>>ps -x 显示后台进程运行的参数

- ps -aux | grep xxx
>>System V 展示风格
>>USER：用户名称
>>PID：进程号
>>%CPU：进程占用 CPU 的百分比
>>%MEM：进程占用物理内存的百分比
>>VSZ：进程占用的虚拟内存大小（单位：KB）
>>RSS：进程占用的物理内存大小（单位：KB）
>>TTY：终端名称,缩写 .
>>STAT：进程状态，其中 S-睡眠，s-表示该进程是会话的先导进程，N-表示进程拥有比普通优先级更低的优先级，R-
>>正在运行，D-短期等待，Z-僵死进程，T-被跟踪或者被停止等等
>>STARTED：进程的启动时间
>>TIME：CPU 时间，即进程使用 CPU 的总时间
>>COMMAND：启动进程所用的命令和参数，如果过长会被截断显示

- kill [选项] 进程号 
>终止进程
>-9 强迫进程立即停止** killall 进程名称 
>通过进程名称杀死进程,也支持通配符,在系统因负载过大而变得很慢时很有用
#### 查看进程树

- pstree [选项],可以更加直观的来看进程信息
> -p 显示进程的PID
> -u 显示进程的所属用户
#### 服务(service)管理

服务(service)本质就是一个进程,但是运行在后台的,通常都会监听某个端口,等待其他程序的请求,比如(mysql,sshd,防火墙等),因此我们又称为守护进程,是Linux中非常重要的知识点.

- service管理指令
> 1.service服务名 [ start | stop| restart | reload | status ]
> 2.在CentOS7后,很多服务不再使用service,而是systemctl
> 3.service指令管理的服务在/etc/init.d 查看
> setup命令查看服务
- 服务的运行级别(runlevel),Linux系统有7种运行级别(runlevel) : 常用的是级别3和5
> 0 系统停机状态,系统默认运行级别不能设置0,否则不能正常运行
> 1 单用户工作状态,root权限,用于系统维护,禁止远程登陆
> 2 多用户状态(没有NFS),不支持网络
> 3 完全的多用户状态(有NFS),登陆后进入控制台命令行模式
> 4 系统未使用,保留
> 5 x11控制台,登陆后进入图形GUI模式
> 6.系统正常关闭重启,默认运行级别不能设置6,否则不能正常运行
> [开机] -> [BIOS] -> [/boot] -> [systemd进程1] -> [运行级别] -> [运行对应的服务]
- chkconfig指令
>1. 通过chkconfig命令可以给服务的各个运行级别设置自 启动/关闭
>2. chkconfig指令管理的服务在 /etc/init.d 查看
>3. 注意: CentOS7 后,很多服务使用systemctl管理
- chkconfig
> 查看服务 chkconfig --list [| grep xxx]
> chkconfig 服务名 --list 
> chkconfig --level 5 服务名 on/off 
- systemctl 管理命令
> 1.基本语法 systemctl [ start | stop | restart | status ] 服务名
> 2.systemctl 指令管理的服务在 /usr/lib/systemd/system 查看
- systemctl 设置服务的自启动状态
 >1. systemctl list-unit-files [ | grep 服务名] (查看服务开机启动状态,grep 可以进行过滤)
> 2. systemctl enable 服务名 (设置服务开机启动)
> 3. systemctl disable 服务名 (关闭服务开机启动)
> 4. systemct is-ebabled 服务名(查询某个服务是否自启动的)
- firewall 打开或者关闭指定端口 
打开端口
> firewall-cmd --permanent --add-port=端口号/协议
- 关闭端口
> firewall-cmd --permanent --remove-port=端口号/协议
- 重新载入生效
> firewall-cmd --reload
- 查询端口是否开放
> firewall-cmd --query-port=端口/协议

#### 动态监控进程
- top [选项] 显示运行的进程(动态)
  > -d 秒数 指定top命令每隔几秒更新 默认3s
  > -i 使top不显示任何闲置或僵死进程
  > -p 通过指定监控进程ID来仅仅监控某个进程的状态
- top状态下输入
  >P CPU使用率排序,默认
  >M 内存使用率排序
  >N PID排序
  >q 退出top

#### 监控网络进程
- netstat [选项] 
  >-an 按一定顺序排列输出
  >-p 显示哪个进程在调用
#### rpm包管理
- rpm包的简单指令
  >查询已经安装的rpm列表 rpm -qa|grep xx
- rpm包基本格式
  > 一个rpm包名: firefox-66.6.6-1.el7.centos.x86_64
  > 名称: firefox
  > 版本号 : 66.6.6-1
  > 适用操作系统: el7.centos.x86_64
  > 表示centos7.x的64位系统
  > 如果是i686 i386表示32位系统,noarch表示通用
- rmp包的其他查询指令
  >rpm -qa 查询所安装的所有rpm软件包
  >rpm -qa | more
  >rpm -qa | grep X [rpm -qa | grep firefox]
  >
  >rpm -q 软件包名 : 查询软件包是否安装
  >
  >rpm -qi 软件包名 : 查询软件包是否安装
  >
  >rpm -ql 软件报名 : 查询软件包种的文件
  >
  >rpm -qf 文件全路径名 查询文件所属的软件包
  >>rpm -qf /etc/passwd
  >
- 卸载rpm包
  >rpm -e RPM包名称
  >rpm -e --nodeps 强制删除

#### yum
yum是Shell前端软件包管理器,基于RPM包管理,能够指定的服务器自动下载RPM包并且安装,可以自动处理依赖性关系,并且一次安装所有依赖的软件包
-  yum list | grep xx软件列表
  >查询yum服务是否有需要安装的软件包
-  yum install xxx
>安装软件包
- vim /etc/profile
  >修改环境变量
- source /etc/profile
  >让文件生效

关于MySQL的安装
```
1.运行rpm -qa|grep mari，查询mariadb相关安装包
2.运行rpm -e --nodeps mariadb-libs，卸载
3.然后开始真正安装mysql，依次运行以下几条
rpm -ivh mysql-community-common-5.7.26-1.el7.x86_64.rpm
rpm -ivh mysql-community-libs-5.7.26-1.el7.x86_64.rpm
rpm -ivh mysql-community-client-5.7.26-1.el7.x86_64.rpm
rpm -ivh mysql-community-server-5.7.26-1.el7.x86_64.rpm
4.运行systemctl start mysqld.service，启动mysql
5.然后开始设置root用户密码
6.Mysql自动给root用户设置随机密码，运行grep "password" /var/log/mysqld.log可看到当前密码
7.运行mysql -u root  -p，用root用户登录，提示输入密码可用上述的，可以成功登陆进入mysql命令行
8.设置root密码，对于个人开发环境，如果要设比较简单的密码（生产环境服务器要设复杂密码），可以运行
set global validate_password_policy=0;  提示密码设置策略（validate_password_policy默认值1，）

 遇到问题请修改此
	set global validate_password_mixed_case_count=0;
	set global validate_password_number_count=3;
	set global validate_password_special_char_count=0;
	set global validate_password_length=4;

9.set password for 'root'@'localhost' =password('hspedu100');
10.运行flush privileges;使密码设置生效
```
### 10.Shell
Shell是命令行解释器,它为用户提供了一个向Linux内核发送请求以便运行程序的界面系统级程序,用户可以用Shell来启动,挂起,停止甚至是编写一些程序

- 脚本格式要求
	  1. 脚本以#!/bin/bash开头
	  2. 脚本需要有可执行权限

- 脚本执行方式
	  1. 输入脚本路径,需要首先加权限
	  2. 不需要赋权,直接sh执行

- Shell变量介绍
	  1. Linux Shell中的变量分为,系统变量和用户自定义变量.
	  2. 系统变量 : $HOME $PWD $SHELL $USER 等等,比如: echo $HOME 等等..
	  3. 显示房前shell中的所有变量set

- Shell 变量的定义
	  1. 定义变量 : 变量=值
	  2. 撤销变量 : unset 变量
	  3. 声明静态变量 : readonly变量,注意: 不能unset

- 定义规则
	  1. 变量名称可以由字母,数字下划线组成,但是不能以数字开头
	  2. 等号两侧不能有空格
	  3. 变量名称一般习惯大写

- 将命令返回值赋值给变量
	  1. A = \`date\`反引号,运行里面的命令,并且把结果返回给变量
	  2. A = $(date)等价于反引号

- 设置环境变量
	  1. export 变量名=变量值 (功能描述 : 将shell变量输出为环境变量/全局变量)
	  2. source 配置文件  (让修改后的配置信息立即生效)
	  3. echo $变量名 (查询环境变量的值)

- 多行注释
	  1. :<<!       !
___

- 位置参数变量
	  当我们执行一个shell脚本时候,如果希望获取到命令行的参数信息,就可以使用到位置参数变量,比如 : ./myshell.sh 100 200 , 这个就是一个执行shell的命令行,可以在myshell 脚本中获取到参数信息

- 语法
	  1. ==$n== (n为数字,$0代表命令本身,$1-$9代表第一个到第九个参数,,十以上的参数,十以上的参数需要用到大括号包含,如\${10})
	  2. ==\$\*== (这个变量代表命令行中所有参数, $\* 把所有的参数看成一个整体)
	  3. ==$@== (这个变量也代表命令行中所有的参数,不过\$@把每隔参数区分对待)
	  4. ==\$\# ==(这个变量代表命令行中所有参数的个数)

- 预定义变量
	就是shell设计者实现已经定义好的变量,可以直接在shell脚本中使用
- 基本语法
	1. \$\$ (当前进程的进程号(PID))
	2. $! (后台运行的最后一个进程的进程号 (PID))
	3. $? (最后一次执行的命令的返回状态. 如果这个变量的值为0,证明上一个命令正确执行; 如果这个变量的值为非0 (具体是哪个数,有命令自己来决定), 则证明上一个命令执行不正确了)

- 运算符
	  1. $((运算式)) 或 $\[运算式] 或 expr m + n
	  2. 注意expr运算符间要有空格 如果希望将expr结果赋给某个变量 使用 \`\`
	  3. expr m -n
	  4. expr \\*  / % 算数运算符
```
#!/bin/bash
#案例1:计算(2+3)*4的值
A=2
B=3
SUM=$[(A+B)*4]
echo $SUM
C=`expr 3 + 3`
D=`expr $C \* 4`
echo $D
unset SUM
#案例2:求出命令行的两个参数和
SUMS=$[$1+$2]
echo $SUMS
```
- 条件判断
	1. \[ condition ] (注意condition前后要有空格)
	2. \#非空返回ture,可使用%?验证( 0为true , >1为fasle )
- 常用判断
	1. = 字符串比较 两个整数的比较
	2. -lt 小于 little 
	3. -le 小于等于 little equal
	4. -eq 等于 
	5. -gt 大于
	6. -ge 大于等于
	7. -ne 不等于
- 文件权限判断
	  1. -r 有读的权限
	  2. -w 有写的权限
	  3. -x 有执行的权限
- 按照文件类型进行判断
	  1. -f 文件存在并且是一个常规的文件
	  2. -e 文件存在
	  3. -d 文件存在并是一个目录
- 流程控制
if 
```
if [ 条件判断式 ]
	then
	代码
fi
或者 , 多分支
if [ 条件判断式 ]
	then
	代码
elif [条件判断式]
then
	代码
fi
注意事项：[ 条件判断式 ]，中括号和条件判断式之间必须有空格
```
case 
```
case $x in
"x"）
如果变量的值等于值 1，则执行程序 1
;;
"x"）
如果变量的值等于值 2，则执行程序 2
;;
*）
如果变量的值都不是以上的值，则执行此程序
;;
esac

```
for 
```
for 变量 in 值 1 值 2 值 3…
do
程序/代码
done

for (( 初始值;循环控制条件;变量变化 ))
do
程序/代码
done
```
while
```
while [ 条件判断式 ]
do
程序 /代码
done
注意：while 和 [有空格，条件判断式和 [也有空格
```
read
```
read(选项)(参数)
选项：
-p：指定读取值时的提示符；
-t：指定读取值时等待的时间（秒），如果没有在指定的时间内输入，就不再等待了。。
参数
变量：指定读取值的变量名
```
- 系统函数
```
basename 功能：返回完整路径最后 / 的部分，常用于获取文件名
basename \[pathname] \[suffix]
basename \[string] \[suffix]
	功能描述：basename 命令会删掉所有的前缀包括最后一个（‘/’）字符，然后将字符串显示出来。
suffix 为后缀，如果 suffix 被指定了，basename 会将 pathname 或 string 中的 suffix 去掉。

dirname 功能：返回完整路径最后 / 的前面的部分，常用于返回路径部分
dirname 文件绝对路径 （功能描述：从给定的包含绝对路径的文件名中去除文件名（非目录的部分），然后返回剩
下的路径（目录的部分））
```
- 自定义函数
```
[ function ] funname[()]
{
Action;
[return int;]
}
调用直接写函数名：funname
[值]

例:
#!/bin/bash
function getSum(){
        #SUM=$[$n1+$n2]
        SUM=$[$1+$2]
        echo $SUM
}
#read -p "请输入一个数" n1
#read -p "请输入一个数" n2
#getSum $n1 $n2
getSum $1 $n2

```