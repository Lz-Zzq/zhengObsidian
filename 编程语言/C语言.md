 ## 1. 初识C语言
###### 1.1 目标代码,可执行文件和库
	源代码->编译器->目标代码(.obj)->链接器(库代码,启动代码)->可执行代码(.exe)
**启动代码**: 启动代码充当程序和操作系统之间的接口
**链接器:** 将编写的目标代码,系统的标准启动代码和库代码合并成可执行文件
	注: C编译器生成的中间代码文件名是.obj也可能是其他文件
函数可以使用 #include <头文件> 导入 #include 编译器预处理
	在main函数上声明的函数是 **函数原型**
	程序内部使用函数是 **函数调用**
## 2. 数据和C

##### 2.1 数据类型关键字

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
| 符号      | 意义                                                                                            |
| --------- | ----------------------------------------------------------------------------------------------- |
| %d        | 打印数字                                                                                        |
| %u        | 无符号int                                                                                       |
| %ld %lu   | long int unsigned long 以此类推                                                                 |
| %lx       | 十六进制打印long                                                                                |
| %lo       | 八进制打印long                                                                                  |
| %hd       | 十进制 short                                                                                    |
| %lld llu  | 十进制long long unsigned long                                                                   |
| %.1f      | 浮点数保留一位小数                                                                              |
| %e a      | 指数计数法 十六进制格式浮点数                                                                   |
| %lf le la | long double 指数计数 十六进制格式浮点数                                                         |
| %c        | 字符                                                                                            |
| %g        | 根据值不同,自动选择%f %e 格式用于指数小于-4或者大于等于精度时                                   |
| %i        | %d                                                                                              |
| %p        | 指针                                                                                            |
| %s        | 字符串                                                                                          |
| %#x       | 十六进制带前缀                                                                                  |
| h         | %hu %hx %6.4hd 表示short int unsigned short int 类型的值                                        |
| j         | intmax_t unitmax_t类型的值 %jd %8jx                                                             |
| l         | long int unsigned long int %ld %8lu                                                             |
| ll        | long long int unsigned long long int %lld %8lu                                                  |
| L         | long double %lf %10.4Le                                                                         |
| t         | ptrdiff_t %td %12ti ptrdiff_t表示的时两个指针的差                                               |
| z         | size_t类型的值 size_t时sizeof返回类型 %zd %12zd                                                 |
| \-        | 左对齐 %-20s 左对齐20空格(包含)                                                                 |
| \+        | 有符号,正数+ 负数-                                                                              |
| \#        | 前缀                                                                                            |
| 0         | 前导0代替空格 %010d 10空格 %0.84f %010.5f 表示(前导0 10空格 显示5个(使用浮点显示不写前导也行) ) |
| 0         | 当使用 %010.5f 与 %10.5性质一样 占位10 显示5 多余使用前导0代替 浮点显示自动添加前导0            |
| \a        | 警报                                                                                            |
| \b        | 退格                                                                                            |
| \f        | 换页                                                                                            |
| \n        | 换行                                                                                            |
| \r        | 回车                                                                                            |
| \t        | 水平制表符                                                                                      |
| \v        | 垂直制表符                                                                                      |
| \0oo      | 八进制                                                                                          |
| \xhh      | 十六进制                                                                                        |
|     \t      |          制表符                                                                                       |
|     \v      |             垂直制表符                                                                                    |
|      \0oo     |        八进制                                                                                         |
|     \xhh      |          十六进制                                                                                       |
|    int32_t       |    32位有符号整数类型 (stdint.h inttypes.h 可移植类型)                                        |
|      int_least32_t      | 最小宽度32位整数                                                                                      |
|    intmax_t        |           存储任何有效符号整数值                                                                        |
|         uintmax_t  |         最大无符号整数类型                                                                                 |
|   int_fast32_t         |          最快32位运算                                                                                      |
|     &      |               取地运算符                                                                                   |

**常量与C预处理器**

#define 明示常量 **预编译**\[简单的替换] const表示只读类型

**C 预处理器**不是编译器的组成部分，但是它是编译过程中一个单独的步骤,类似于文本替换工具,编译之前完成预备处理
#include "" 是指从当前包目录中引入头文件   <>是指从系统中引入头文件
编译器会在字符串后面加上空字符

fflush(stdout)  当打印内容时,输出不会立即写入到屏幕,而是被发送到stdout,相当于一个缓冲区
默认情况下stdout是行缓冲,当遇到换行符时会发送,如果覆盖默认缓冲行为,可以使用该方法

### 指针
`int *ptr = &num`  这里的&num是指地址   \*ptr中存放的是对应地址内存中存放的值   ptr是指当前指针指向的地址

C语言内存布局图
![[Pasted image 20230413073453.png | 600]]![[Pasted image 20230526202430.png|500]]
对于普通的全局变量,整个工程可见,其他文件可以使用extern外部声明后直接使用
静态全局变量仅仅对于当前文件可见  

### **枚举**

```
//语法
enum SEASON {  
SPRING = 0, SUMMER = 3, AUTUMN = 6, WINTER = 9  
} day; //day默认第一个值的元素 整数可以转换为枚举类型

//enum SEASON {  
// 默认值0 默认值1 值6 默认值7  
// SPRING, SUMMER, AUTUMN = 6, WINTER  
//} day;

int main(){
	enum SEASON season;  //定义枚举  可以转换int类型
	day = 5; 枚举类型可以直接转换为int类型
}

```

### 字符串指针与字符数组
- 字符数组由若干个元素组成,每个元素放一个字符; 而字符指针变量中存放的是地址(字符串/字符数组的首地址)
```
 int var[] = {10,100,200};
 int i, *ptr[3]; 
 //prt是指针数组 ptr[n]只能存放地址 *prt代表数组中的每个值都是指针 *ptr[n] 代表取出数组中的每个值 可以直接存放值
 ptr < var[1]  判断ptr指针是否小于var[1]中的数据   这是一个错误的案例 类型不兼容  ptr是指针所指向的地址
 ptr = &var[0] 判断ptr指向的地址是否等于 var[0]数组中值的地址  地址与地址的比较
 ptr = var  判断ptr指向的地址是否等于var的地址
 ptr > var[1] 判断地址是否大于var[1]数值的地址
 字符数组中 *ptr[3] ptr++ 是指后移  相反--前移
 字符数组中 获取值使用%s 只需要输出 数组名[n] 不需要*  因为 --字符串输出(%s)需要字符串的首地址-- 所以输出时候就根据地址输出
 # %s通过字符串首元素地址输出字符串 遇到\0结束
```
`数组var 与指针数组 *ptr`
![[Pasted image 20230525173312.png|500]]

### 指针的指针
```
int var = 3000, *ptr ,**pptr; 

ptr = &var; //ptr指向var地址  
pptr = &ptr; //pptr指向ptr地址 pptr -> ptr -> varprintf("var的地址 = %p var = %d \n",&var,var);  
printf("ptr的本身的地址 = %p ptr存放的地址 = %p *ptr=%d \n",&ptr,ptr,*ptr);  
printf("pptr本身的地址 = %p pptr存放的地址 = %p **pptr = %d\n",&pptr,pptr,**pptr);

ptr存放的是var的地址    pptr存放的是ptr的地址  *pptr存放的是ptr指向的地址var的地址 **pptr 指向的是ptr指向的var的值

```
### 返回指针
- 用指针返回值时候需要注意,函数运行结束会销毁内部定义所有局部数据
- 所谓销毁不是将局部数据占用内存清除,而是放弃使用权限
- 可以使用static变量来声明以达到效果
### 函数指针
- int (\*pMax)(int,int) = max;   //max是一个函数 此处是一个指针指向了函数地址
- (pMax)(x,y) 获得函数地址,向函数中存放两个值 (\*pMax)(x,y)也可以
### 回调函数
```
void (*f)(void); //定义一个函数指针  返回void类型 接收void类型
void fun1( int(*f)(void) ) //接收一个函数   函数指针指向传递过来的函数地址
{  f(); }  //调用指针指向的函数地址所存放的函数  打印Hello
void fun2 () { printf("Hello") }
main(){
   fun1(fun2);  //将fun2函数的地址传入fun1
   return 0;
}
```
### 动态内存
1. 头文件 \#include <stdlib.h>声明了四个关于内存动态分配的函数
2. 函数原型 void * malloc (usigned int size) //memory allocation
```
- 作用 -- 在内存的**动态存储区(堆)**中分配一个长度为size的连续空间.
- 形参size的类型为无符号整形,函数返回值是所分配区域的第一个字节的地址,即此函数是一个指针类型函数,返回的指针指向该分配域的开头位置
- malloc(100); 开辟100字节的临时空间,返回值为其第一个字节的地址
```
3. 函数原型 void * calloc(unsigned n, unsigned size)
```- 作用--在内存的动态存储区中分配n个长度为size的连续空间,这个空间一般比较大,足以保存一个数组
- 用calloc函数可以为一维数组开辟动态存储空间,n为数组元素个数,每个元素长度为size.
- 函数返回指向所分配域的起始位置的指针;分配不成功,返回NULL.
- p = calloc(50,4); //开辟50\*4个字节临时空间,把起始地址分配给指针变量p
```
4. 函数原型 void free (void \*p)
``` 作用--释放变量p所指向的动态空间,是这部分空间能重新被其他变量使用.
- p是最近一次调用calloc或malloc函数时的函数返回值
- free函数无返回值
- free(p); //释放p所指向的已分配的动态空间
-  函数原型 void \*realloc (void \*p,unsigned int size);
```
5. 函数原型 void \*realloc (void \*p , unsigned int size)
```
- 作用--重新分配malloc或calloc函数获得的动态空间大小,将p指向的动态空间大小改变为size,p的值不变,分配失败返回NULL
- realloc(p,50); //将p所指向的已分配的动态空间 改为50字节
```
### 空指针
- NULL指针是定义在标准库<stdio.h>中的值为零的常量 \#define NULL 0 案例
### 动态内存
- int arr[5]   int \*p, i =10;   此时p指向i的话,p[0]是10 ,而p[1] 则是arr[0] 的值, 偶然性问题,不能依赖此进行编程  在栈中这些内存是连续的 可以读取到数组,指针等,初始化强制转换指针无法读取 
### 结构体 strucat 
- 类似Class
- 结构体使用.  结构指针使用->
### 共用体 union
- union 结构体与共用体不同在于: 结构体的各个成员会占用不同的内存,互相之间没有影响;而共用体的所有成员占用同一段内存,修改一个成员会影响其余所有的成员
```
union data { int n;  char ch;  short m;  };

a.n = 0x40;  //16 进制   此时内存  00000000 00000000 00000000 01000000
printf("%d, %c, %d\n", a.n, a.ch, a.m);  //输出 转换为10进制 64   转换为符号@   转换为十进制64 (shor两个字节 看前两位
```
- 高位影响低位 int 4  short 2 char 1   修改int修改全部字节  修改short修改char全部,修改int部分
### 文件
- C语言把所有的设备都当作文件,所以设备(比如显示器)被处理的方式与文件相同
![[Pasted image 20230604171226.png]]
```
int getchar(void) 函数从屏幕读取下一个可用的字符，并把它返回为一个整数。
int putchar(int c) 函数把字符输出到屏幕上，并返回相同的字符。
char *gets(char *s) 函数从 stdin 读取一行到 s 所指向的缓冲区，直到一个终止符或 EOF。
int puts(const char *s) 函数把字符串 s 和一个尾随的换行符写入到 stdout
int scanf(const char *format, ...) 函数从标准输入流 stdin 读取输入，并根据提供的 format 来浏览输入。
int printf(const char *format, ...) 函数把输出写入到标准输出流 stdout ，并根据提供的格式产生输出。
```
![[Pasted image 20230604172616.png|500]]
