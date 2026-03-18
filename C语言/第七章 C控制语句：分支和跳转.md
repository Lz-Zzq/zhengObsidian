#### getchar()和putchar()
字符输入输出函数
ch = getchar() 函数不带任何参数，他从输入队列中返回下一个字符。
与scanf("%c",&ch)效果一样
putchar() 函数打印它的参数，puchar(ch) 将ch中字符打印出来
printf("%c",ch)与该效果一样
这两个函数通常定义在stdio.h头文件中，通常是预处理宏，而不是真正的函数。

