
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
定时备份数据库案例
```
#!/bin/bash
#备份目录
BACKUP=/data/backup/db
#获取当前时间
DATETIME=$(date +%Y-%m-%d_%H%M%S)
#echo $DATETIME
#数据库的地址
HOST=localhost
#数据库用户名
DB_USER=root
DB_PW=root
#备份的数据库
DATABASE=hspedu

#创建备份目录,如果不存在,就创建
[ ! -d "${BACKUP}/${DATETIME}" ] && mkdir -p "${BACKUP}/${DATETIME}"

#备份数据库
mysqldump -u${DB_USER} -p${DB_PW} --host=${HOST} -q -R --databases ${DATABASE} | gzip > ${BACKUP}/${DATETIME}/$DATETIME.sql.gz

#将文件处理成 tar.gz
cd ${BACKUP}
#将目录直接打包
tar -zcvf $DATETIME.tar.gz ${DATETIME}
#删除对应的备份目录
rm -rf ${BACKUP}/${DATETIME}

#删除10天前的备份文件
find ${BACKUP} -atime +10 -name "*.tar.gz" -exec rm {} \;
echo "备份数据库${DATABASE}成功!"
```
