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