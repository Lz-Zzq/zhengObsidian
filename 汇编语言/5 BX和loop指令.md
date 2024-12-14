
#### 1.描述
要想完整的描述一个内存单元，需要两种信息：
==1.内存单元地址==
==2.内存单元的长度（类型）==

**\[bx]** 代表了以bx为偏移地址的内存单元
**Loop** ： loop 标号 cpu执行loop指令时候，要进行两部操作
>1.(cx)=(cx-1) 
>2.判断cx中的值，不为零则转到标点符号处执行程序，如果为0则向下执行
```
mov cx,循环次数
s: 
	循环执行的代码段
loop s  (cx-1 等于0则直接退出循环执行下一步操作)
```
**在debug的时候，我们已经知道了循环逻辑是正确的，想直接全部执行，可以使用g命令**
例如：loop s 执行的循环代码段地址 0012
>g 0016可以直接执行到CS:0016处，或者直接使用p命令执行loop命令自动重复执行loop 0012直到(cx) = 0 暂停执行

#### 2.debug与汇编编译器masm对指令的不同处理
>在debug中可以识别 mov ax,\[0] 是 ds:0位置的数据
>
>在masm中会识别为mvo ax,0 并不会识别为上述所述
>目前的方法是，先将偏移地址放入bx中 mov ax,\[bx] 可以定位到该地址 
>或者使用 mov al,ds:\[0] 该含义为 (al) = ((ds)\*16+0)   在\[]前面显式的给出段地址

#### 3.loop与\[bx]的联合应用
计算ffff:0 到 ffff:b数据的和，结果存储在dx中
**1.运算后的结果是否会超出dx存储范围？**
>字节型数据，范围在0-255，12个这样的结果不会大于65535

**2.能否直接将数据累加到dx中？**
>不能，数据是8位的，不能直接加到16位寄存器中

**3.能否将数据累加到dl中，并设置（dh）=0，从而设置累加？**
>不能，因为dl是8位寄存器，能容纳数据范围0-255之间，如果向dl中累加12个8位数据，有可能造成进位丢失

从上面分析出两个问题：类型的匹配和结果的不超界
解决：将数据存放在al中，将ah置为0，让bx+=ax循环执行 实现累加效果

```
assume cs:codesg
codesg segment
	
	mov ax, 0ffffh
	mov ds,ax   ；初始化指向
	mov dx,0
	mov bx,0     ；初始化累加计数器
	mov cx,12    ；初始化计数器

    s: mov al,[bx]   ；将值送入al
	mov ah,0    ；将ah置为0
	add dx,ax     ；累加到dx中
	inc bx      ；bx+1 偏移地址向后移位
	loop s

	mov ax,4c00H
	int 21H

codesg ends
end
```
#### 4.段前缀
指令mov ax,\[bx]中，内存单元的偏移地址由bx给出，段地址默认ds中，我们可以显式的给出内存单元的段地址所在的段寄存器
>mov ax,ds:\[bx]
>mov ax,cs:\[bx]
>mov ax,ss:\[bx]
>mov ax,es:\[bx]
>mov ax,ss:\[0]
>mov ax,cs:\[0]
>在汇编语言中这些称之为段前缀  

回溯点：
只能将段前缀数据传送至寄存器中
<font color=yellow>在x86汇编中，内存访问偏移地址一般来自一下寄存器bx,bp(基指针)，si(源索引)，di(目的索引),其他可能会导致错误</font>

#### 5.一段安全的空间
在一般的PC机中，DOS方式如下，DOS和其他合法程序一般都不会使用0：200 - 0：2ff(00200h-002ffh)的256个字节空间

#### 实验4 \[bx] 与loop的使用
将mov ax4c00h之前的指令复制到0：200处
```
assume cs:codesg

codesg segment
	
	mov ax,**cs**
	mov ds,ax
	mov ax,0020H
	mov es,ax
	mov bx,0
	mov cx,**17H**

     s: mov al,[bx]
     	mov es:[bx],al
	inc bx
	loop s

	mov ax,4c00H
	int 21H

codesg ends

end
```
