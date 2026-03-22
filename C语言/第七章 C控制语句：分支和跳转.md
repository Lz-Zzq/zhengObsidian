#### getchar()和putchar()
字符输入输出函数
ch = getchar() 函数不带任何参数，他从输入队列中返回下一个字符。
与scanf("%c",&ch)效果一样
putchar() 函数打印它的参数，puchar(ch) 将ch中字符打印出来
printf("%c",ch)与该效果一样
这两个函数通常定义在stdio.h头文件中，通常是预处理宏，而不是真正的函数。

#### ctype.h文件
这个一个专门处理字符的函数
![[e7f57d69209428ce367a0d4ac9d2ae64.jpg | 500]]

#### 条件运算符/三目运算符
```c
x = (y < 0) ? -y : y;
如果 y<0 则 x= -y
否则 x = y
```

#### break语句与continue
break语句与continue语句都可以跳出循环，continue是从当前位置跳出本次循环进入下一次循环，而break是直接终止当前循环直接执行下一阶段。
![[6fde24259df568666613c5ee92bbad39.jpg | 300]]

#### switch语句
语法
默认情况下，如果没有break，整个switch中的所有case都会运行，包括defualt
```c
switch( 整式表达式 ){
	case 常量1：
		语句
	case 常量2：
	    语句
	default :
		语句
}
//多重标签
switch( 整式表达式 ){
	case   'a' :  //如果定位到a，那么执行a，a中case没有语句，没有break，直接执行case 'A'中的代码，本质上，case 'a'与case'A'都指向同一个语句
	case   'A':
		语句
	case 常量2：
	    语句
	default :
		语句
}
```
#### goto语句 
```c
goto part2;
part2: printf(......)
```
break与continue是某种形式的goto语句，goto语句可以当成if判断语句与while循环语句使用。
尽量避免使用goto语句，不过可以使用goto语句跳出一个大的嵌套循环，因为break只能跳出一个。

#### 缩进
关于并行缩进的一个例子
```c
if(i == 4) 
	i++;
	i--;

```
<span style="color:yellow">i--在任何情况下都会运行，因为并行缩进之对于if for等语句紧随其后的代码有效，所以条件是否成立，i--都会运行</span>这在python中是成立的，但是在c语言中不行。建议始终使用大括号

