使用yum安装docker（安装过程可以参照linux 安装docker），如需卸载docker可以按一下步骤操作：

1、查看当前docker状态  如果是运行状态则停掉
systemctl stop docker

2、查看yum安装的docker文件包
 yum list installed |grep docker

3、删除所有安装的docker文件包
yum -y remove \[name]

5.删完之后可以再查看下docker rpm源
rpm -qa |grep docker   显示为null则完毕

4、删除docker的镜像文件，默认在/var/lib/docker目录下 

rm -rf /var/lib/docker
 