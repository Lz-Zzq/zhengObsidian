### 初识C语言
**目标代码,可执行文件和库**
	源代码->编译器->目标代码(.obj)->链接器(库代码,启动代码)->可执行代码(.exe)
**启动代码**: 启动代码充当程序和操作系统之间的接口
**链接器:** 将编写的目标代码,系统的标准启动代码和库代码合并成可执行文件
	注: C编译器生成的中间代码文件名是.obj也可能是其他文件
函数可以使用 #include <头文件> 导入 #include 编译器预处理
	在main函数上声明的函数是 **函数原型**
	程序内部使用函数是 **函数调用**
### 数据类型关键字

| 字段      | 类型                         | 根据不同 系统/字长/编译器 有所不同 |
| --------- | ---------------------------- | ---------------------------------- |
| int       | 整数类型                     | 4字节                              |
| long      | 长整型                       | 4字节                              |
| short     | 短整型                       | 2字节                              |
| unsigned  | 无符号                       |                                    |
| char      | 字符                         | 1字节                              |
| float     | 类型可以表述精度为6为小数点  | 4字节                              |
| double    | 类型可以表述精度为15为小数点 | 8字节                              |
| signed    | 有符号                       |                                    |
| void      | 无返回值类型                 |                                    |
| \_Bool    | bool类型                     | 1字节                              |
| \_Complex | 复数                         |                                    |
|    \_Imaginary      |      虚数                        |                                    |
|    long long       |                              |         8字节                           |
|     long int      |                              |             4字节                          |
|   long double        |                              |   16字节                                 |
| char[]  |   char[]字符数组 最后一位是 \0空字符 可用长度为length-1   |      n                              |


##### 2.2 转换

| 符号          | 意义                                                                                            |
| ------------- | ----------------------------------------------------------------------------------------------- |
| %d            | 打印数字                                                                                        |
| %u            | 无符号int                                                                                       |
| %ld %lu       | long int unsigned long 以此类推                                                                 |
| %lx           | 十六进制打印long                                                                                |
| %lo           | 八进制打印long                                                                                  |
| %hd           | 十进制 short                                                                                    |
| %lld llu      | 十进制long long unsigned long                                                                   |
| %.1f          | 浮点数保留一位小数                                                                              |
| %e a          | 指数计数法 十六进制格式浮点数                                                                   |
| %lf le la     | long double 指数计数 十六进制格式浮点数                                                         |
| %c            | 字符                                                                                            |
| %g            | 根据值不同,自动选择%f %e 格式用于指数小于-4或者大于等于精度时                                   |
| %i            | %d                                                                                              |
| %p            | 指针                                                                                            |
| %s            | 字符串                                                                                          |
| %#x           | 十六进制带前缀                                                                                  |
| h             | %hu %hx %6.4hd 表示short int unsigned short int 类型的值                                        |
| j             | intmax_t unitmax_t类型的值 %jd %8jx                                                             |
| l             | long int unsigned long int %ld %8lu                                                             |
| ll            | long long int unsigned long long int %lld %8lu                                                  |
| L             | long double %lf %10.4Le                                                                         |
| t             | ptrdiff_t %td %12ti ptrdiff_t表示的时两个指针的差                                               |
| z             | size_t类型的值 size_t时sizeof返回类型 %zd %12zd                                                 |
| \-            | 左对齐 %-20s 左对齐20空格(包含)                                                                 |
| \+            | 有符号,正数+ 负数-                                                                              |
| \#            | 前缀                                                                                            |
| 0             | 前导0代替空格 %010d 10空格 %0.84f %010.5f 表示(前导0 10空格 显示5个(使用浮点显示不写前导也行) ) |
| 0             | 当使用 %010.5f 与 %10.5性质一样 占位10 显示5 多余使用前导0代替 浮点显示自动添加前导0            |
| \a            | 警报                                                                                            |
| \b            | 退格                                                                                            |
| \f            | 换页                                                                                            |
| \n            | 换行                                                                                            |
| \r            | 回车                                                                                            |
| \t            | 水平制表符                                                                                      |
| \v            | 垂直制表符                                                                                      |
| \0oo          | 八进制                                                                                          |
| \xhh          | 十六进制                                                                                        |
| \t            | 制表符                                                                                          |
| \v            | 垂直制表符                                                                                      |
| \0oo          | 八进制                                                                                          |
| \xhh          | 十六进制                                                                                        |
| int32_t       | 32位有符号整数类型 (stdint.h inttypes.h 可移植类型)                                             |
| int_least32_t | 最小宽度32位整数                                                                                |
| intmax_t      | 存储任何有效符号整数值                                                                          |
| uintmax_t     | 最大无符号整数类型                                                                              |
| int_fast32_t  | 最快32位运算                                                                                    |
| &             | 取地运算符                                                                                      |
| *              | 字符宽度    打印函数中宽度  输入函数中跳过                                                                                 |

**常量与C预处理器**

#define 明示常量 **预编译**\[简单的替换] const表示只读类型

**C 预处理器**不是编译器的组成部分，但是它是编译过程中一个单独的步骤,类似于文本替换工具,编译之前完成预备处理
#include "" 是指从当前包目录中引入头文件   <>是指从系统中引入头文件
编译器会在字符串后面加上空字符

fflush(stdout)  当打印内容时,输出不会立即写入到屏幕,而是被发送到stdout,相当于一个缓冲区
默认情况下stdout是行缓冲,当遇到换行符时会发送,如果覆盖默认缓冲行为,可以使用该方法


C语言内存布局图
![[Pasted image 20230413073453.png | 300]]![[Pasted image 20230526202430.png|500]]
对于普通的全局变量,整个工程可见,其他文件可以使用extern外部声明后直接使用
静态全局变量仅仅对于当前文件可见  

### 字符串 
```
char数组 (字符串)
	C语言字符串存在于char数组中  末尾位置为\0 这是空字符  40长度char数组实际只能存放39
scanf()
	遇到第一个空白结束读取   参数%c  则会从第一个字符读取  空格%c则会从第一个非空白字符读取
	注: 除了%c,其他的转换说明都会自动跳过带输入值前面的空白
	scanf 检查到文件尾部会返回EOF
预处理字符串
	预处理字符串编译器会在后面添加一个空字符
strlen()
	字符长度
sizeof
	字节单位给出对象大小
常量/预处理
	 #define TXT 0.04 编译时替换   明示常量/符号常量
const
	只读
limits.h float.h中的明示常量
	书中79页
转换
	sizeof 运算符 返回占用空间的字节数  (早期)与strlen()返回的实际类型通常是unsigned /long  c99/11 为此类型返回
	shot int = 336;  如果转换为%c 则取出 226/256的余数80    2字节取出后1字节  相当于以256为模  其余类型当多/少数值情况,计算机会进行取模
	当打印转换的字节容量小于变量字节容量 %ld打印double类型 则会导致只会读取前面4字节
printf scanf使用*
	不确定需要多少空格 可以使用 printf("%*d",5) 则五个空格
	在scanf中使用%*d则会跳过当前输出项,获取第二个输出项 
```
### 运算符
```
左值  (早期C)
	指定一个对象,所引用内存中的地址
	它可以在赋值运算符左侧
	C语言引入const时,左值的定义不能满足当前状态 新的术语: 可修改的左值
右值
	能复制给可修改左值的量,而且本身不是左值
typedef  
	别名   typedef double real      real就是double的别名
++  --
	在变量前面称之为前缀模式,在变量后面称之为后缀模式
	++与--在序列点开始递增
序列点
	程序执行的点,所有副作用在下一步执行
	while(gue ++ < 10)   gue++ <10 是一个完整的表达式,该表达式结束就是序列点
表达式
	运算符运算对象组成
	a*b/c
语句
	C程序的基本构建块
	a*b/c;  
	;空语句
复合语句
	{} 包围的语句
类型转换
	参数传递 char short 转换成为int   float被转换成double
```
