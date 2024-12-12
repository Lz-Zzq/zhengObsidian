### 1 C程序几个部分
![[3c9b6c39d089802432ee2d2628a6901.jpg | 400]]
**\#include这一行代码是一条预处理指令。** 实际上，这是一种拷贝粘贴
**通常C编译器会在编译前对源代码做一些准备工作，即预处理**
\# 表明C预处理器会在编译器接手前处理这条指令
#### 1.1 main()函数
C程序从main函数中开始执行，**函数是C程序的基本模块**
关键字是C语言的词汇
#### 1.2 printf()函数
printf()函数圆括号表明printf是一个函数名
**圆括号中的内容是main()函数传递给printf()函数的信息**，是函数的实参。

#### 1.3函数原型（函数声明）
```c
void butler(void); /*ANSI/ISO C函数原型*/
int main(void) {

	int n = 5;
	int n2;
	n2 = n * n;
	
	printf("I will summon the butler function.\n");
	butler();
	printf("Yes. Bring me some tea and writeable DVDs.\n");
	return 0;
}

void butler(void) /*函数定义开始*/
{
	printf("You rang, sir?\n");
}
```
第一次是**函数原型**，告知编译器在程序中要使用该函数；
第二次是**函数调用**
第三次是**函数定义**
