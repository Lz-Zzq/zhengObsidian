
call指令与ret指令都是转移指令，它们都修改了IP，或者同时修改了CS和IP。他们经常被共同用来实现子程序的设计。
#### 1.ret和retf
ret指令用栈中的数据，修改IP的内容，从而实现**近转移**
retf指令用栈种的数据，修改CS和IP的内容，从而实现**远转移**。

CPU执行ret指令时，进行下面两部操作
>`(IP)=((ss)*16+(sp))`
>`(sp)=(sp)+2`

cpu执行retf指令时，进行下面四部操作
>(IP)=((ss)\*16+(sp))
>(sp)=(sp)+2
>(CS)=((ss)\*16+(sp))
>(sp)=(sp)+2

可以看处，如果我们用汇编语法来解释ret和retf指令，则：
CPU执行ret指令时，相当于进行 
>pop ip


CPU执行retf指令时，相当于进行
>pop ip 
>pop cs

```
stack segment
	db 16 dup (0)
stack ends

code segment
	mov ax,4c00h
	int 21h
start :mov ax,stack 
	mov ss,ax
	mov sp,16
	push cs
	push ax
	mov bx,0
	retf
code ends
end start
```
#### 2.call指令
CPU执行call指令时，进行两部操作：
1. 将当前的IP或CS和IP压入栈
2. 转移
call指令不能实现短转移，除此之外，call指令实现转移的方法和jmp指令的原理相同。

#### 3.依据位移进行转移的call指令
**call 标号（将当前的IP压入栈，转到标号处执行指令）**
cpu执行这种格式的call指令时，进行如下操作：
>1. (sp)=(sp)-2
((ss)\*16+(sp))=(IP)
>2. (IP)=(IP)+16位位移

16位位移=标号处的地址-call指令后的第一个字节的地址；
16位位移的范围为-32768~32767，用补码表示；
16位位移由编译程序在编译时算出

CPU执行call 标号时，相当于
>push IP
   jmp near ptr 标号

ax中的值是多少?
```
assume cs:code
code segment
start:  
1000:0	mov ax,0
1000:3	call s
1000:6	inc ax
1000:7 s: pop ax

	mov ax,4c00h
	int 21h
code ends
end start

```
ax=6
#### 4.转移的目的地址再指令中的call指令
**call far ptr 标号**实现的是**段间转移**
CPU执行此种格式的call指令时，进行如下操作。
>1. (sp)=(sp)-2
>    ((ss)\*16+(sp))=(cs)
>    (sp)=(sp)-2
>    ((ss)\*16+(sp))=(IP)
>2. (cs) = 标号所在段的段地址
>    (IP) = 标号在段中的偏移地址

汇编语法解释
CPU执行“call far ptr 标号” 相当于：
```
push cs
push ip
jmp far ptr 标号
```
ax中值是多少， ax=10016
```
	mov ax,0
	call far ptr s
	inc ax
   s:   pop ax
    
    add ax,ax
	pop bx
	add ax,bx
```
#### 5.转移地址在寄存器中的call指令
指令格式：call 16位reg #reg
功能：
>(sp)=(sp)-2
   ((ss)\*16+(sp))=(IP)
   (IP)=(16位reg)

用汇编解释，CPU执行“call 16位reg”时
>push IP
   jmp 16位reg

ax中值为多少
```
0  mov ax,6
3	call ax
5	inc ax
6	mov bp,sp
   add ax,[bp]
```
疑问： ax值为11 ，使用pop的指令取出值也是5，不知道为什么ds:\[bp]能将栈中的值取出？只是偏移地址相同，但是ds与ss的地址是不同的，在ss段中也没有找到5
解答：**为什么bp能取出栈中的值？**
当bp被设置为SP的值（或者SP的一个偏移量）时，BP就指向了堆栈的当前顶部（或者某个偏移位置）。因此，通过BP可以访问堆栈上的数据。然后就得到了5。就**相当于SS:SP**。如果切换为bx，则无法取出数据，bx会直接将地址中的数据传送给ax，就**相当于DS:\[bx] 。这传送的是一个未知的数据，取决于bx的偏移量**
**bp取得栈顶数据，将sp偏移地址赋值给bp，\[bp]取出栈空间元素**

#### 6.转移地址在内存中的call指令
两种格式
**1.call word ptr 内存单元地址**
汇编语法来解释此种格式call指令
CPU执行“call  word ptr 内存单元地址时”，相当于
```
push IP
jmp word ptr 内存单元地址
```
比如下面指令
```
mov sp,10h
mov ax,0123h
mov ds:[0],ax
call word ptr ds:[0]
```
执行后，(IP)=0123H,(sp)=0EH。

**2.call dword ptr 内存单元地址**
汇编语法：
CPU执行“call dword ptr 内存单元地址”
```
push CS
push IP
jmp dword ptr 内存单元地址
```
比如下面的指令
```
mov sp,10h
mov ax,0123h
mov ds:[0],ax
mov word ptr ds:[2],0
call dword ptr ds:[0]
```
执行后，(CS)=0,(IP)=0123H,(sp)=0CH。
注解：push进入栈中的cs与ip还是源csip，执行后只不过转移到了ds:\[0]数据地址，也就是csip指向了了ds:\[0]中的数据

下面程序执行后，ax值为多少？注意：call指令原理来分析，不要再Debug中单步跟踪来验证结论）因为debug中的结果不代表最终CPU执行结果
```
assume cs:code

stack segment 
	dw 8 dup (0)
stack ends

code segment

start:  
	mov ax,stack
	mov ss,ax
	mov sp,16
	mov ds,ax
	mov ax,0
	call word ptr ds:[0E]
	inc ax
	inc ax
	inc ax

	mov ax,4c00h
	int 21h
code ends

end start
```
结果ax=3，因为将IP压入栈，IP=11，0E处的数据就是栈中的11，转移到11处执行

下面程序中ax，bx是多少？
```
assume cs:code

stack segment 
	dw 8 dup (0)
stack ends

code segment

start:  
	mov ax,stack
	mov ss,ax
	mov sp,16
	mov word ptr ss:[0],offset s
	mov ss:[2],cs
	call dword ptr ss:[0]
	nop
     s: mov ax,offset s
	sub ax,ss:[0cH]
	mov bx,cs
	sub bx,ss:[0eH]

	mov ax,4c00h
	int 21h
code ends

end start
```
首先，将s偏移地址1A放入栈空间0处，CS放入2处，随后将CSIP压入栈中，IP指向nop偏移地址处也就是19。ax指向s（1A），1A - C处数据（就是压入栈中的IP19），ax=1
将cs放入bx中,bx-栈空间E处数据（就是压入栈中的cs）bx=0
![[汇编语言/img/Pasted image 20240817122105.png|400]]![[汇编语言/img/Pasted image 20240817122131.png|400]]
#### 7.call和ret的配合使用
```
assume cs : code
stack segment 
	db 16 dup(0)
stack ends

code segment
	start:mov ax,stack          1001:0000    B8 00 10
	mov ss,ax                       1001:0003    8E D0
	mov sp,16                      1001:0005    BC 10 00
	mov ax,1000                  1001:0008    B8 E8 03
	call s                              1001:000B    E8 05 00
	mov ax,4c00h                1001:000E    B8 00 4C
	int 21h                           1001:0011    CD 21
s :    add ax,ax                        1001:0013    03 C0
	ret                                  1001:0015    C3
code ends
end start
```
call 指令读入后，（IP）=000EH,CPU指令缓冲器中的代码为：E8 05 00;
CPU执行后E8 05 00 栈中压入 0E
然后（IP）=（IP）+0005=0013H
CPU从cs：0013H处（标号s处）开始执行
ret读入指令后：IP=0016H  CPU指令缓冲器代码为C3
CPU执行C3 相当于pop IP
CPU回到cs:000EH处继续执行

利用call和ret来实现子程序机制。
标号：
	指令
	ret
```
assume cs:code
code segment
	main:
	·
	call sub1          ;调用子程序sub1
	mov ax,4c00H
	int 21h
	
	sub1:
	·
	call sub2        ;调用子程序sub2
	·
	ret                ；子程序返回
	
	sub2:          ；子程序sub2开始
	·
	ret                 ；子程序返回
```
#### 8.mul指令
mul指令，乘法指令，使用mul做乘法时候，注意以下两点：
==1.两个相乘的数：要么都是8位，要么都是16位。如果8位，一个默认放在al中，另一个放在8位reg或内存字节单元中，如果16位，默认在ax中，另一个放在16位reg或者内存字单元中。
2.结果：如果是8位乘法，结果默认放在ax中；如果是16位乘法，结果高位默认dx中，低位ax中==
格式如下：
`mul reg`
`mul 内存单元`
内存单元可以用不同的寻址方式给出，比如：
mul byte ptr ds:\[0]
>含义：（ax）=（al）\*((ds)\*16+0)

mul word ptr \[bx+si+8]
>含义：
（ax）=（ax）\*((ds)\*16+(bx)+(si)+8)结果的低16位
（dx）=（ax）\*((ds)\*16+(bx)+(si)+8)结果的高16位

例：
计算100\*10
```
mov al,100
mov bl,10
mul bl
```
计算100\*1000
```
mov ax,1000
mov bx,100
mul bx
```
#### 9.参数和结果传递的问题
计算data段中第一组数据的3次方，结果保存在后面一组dword单元中
```
assume cs:code
data segment 
	dw 1,2,3,4,5,6,7,8
	dd  0,0,0,0,0,0,0,0
data ends
code segment
	start : mov ax,data
	mov ds,ax            
	mov si,0                    ;ds:si指向第一组
	mov di,16                  ;ds:di指向第二组

	mov cx,8
s :     mov bx,[si]
	call cube
	mov [di],ax
	mov [di].2,dx
	add si,2                     ;ds:si指向下一个word单元
	add di,4                    ;ds:di指向下一个dword单元
	loop s

	mov ax,4c00h
	int 21h

cube :  mov ax,bx
	mul bx
	mul bx
	ret
code ends
end start
```
#### 10.批量数据的传递
前面的例子，子程序cube只有一个参数，放在bx中，如果有两个，就可以用两个寄存器，如果需要传递的数据又更多呢，我们怎么样存放呢，返回值也有同样的问题。

这种时候，我们批量的将数据放到内存中，然后将他们所在的内存空间的首地址放在寄存器中，传递给需要的子程序。对于具有批量的返回结果也使用这种方法

将字符串中数据转为大写
```
assume cs:code
data segment
	db 'conversation'
data ends
code segment
	start: mov ax,data
	mov si,0
	mov cx,12
	call capital
	mov ax,4c00h
	int 21h

capital : and byte ptr [si],11011111b         ;将ds:si所知单元中的字母转换为大写
	inc si                                                  ;ds:si指向下一个单元
	loop capital
	ret
code ends
end start
```
注意：除了寄存器传递参数外，还有一种通用的方法使用栈来传递参数。请看附注4[[汇编语言附注]]

#### 11.寄存器冲突问题
```

code segment
data segment
	db 'word',0
	db 'word',0
	db 'word',0
	db 'word',0
data ends
start : 
	mov ax,data
	mov ds,ax
	mov bx,0

	mov cx,4
s:
	mov si,bx
	call capital
	add bx,5
	loop s

	mov ax,4c00h
	int 21h
	
capital : 
	mov cl,[si]
	mov ch,0
	jcxz ok
	and byte ptr [si],11011111b
	inc si
	jmp short capital
ok :  ret

code ends
end start
```
这个程序的问题在于cx的使用，主程序要使用cx记录循环次数，可是子程序中也使用了cx，在执行子程序的时候，cx中保存的循环计数值被改变，使得主程序的循环出错。

我们希望：
1.编写调用子程序的程序的时候不必关心子程序使用那些寄存器
2.编写子程序的时候不必关心调用者使用了哪些寄存器
3.不会发生寄存器冲突

解决这个问题简洁方法是，在子程序的开始将子程序中所有用到寄存器中的内容都保存起来，在子程序返回前在恢复，可以用栈来保存寄存器中的内容

以后，我们编写子程序的标准框架如下： 
```
子程序开始：
	子程序中使用的寄存器入栈
	子程序的内容
	子程序中使用的寄存器出栈
	返回（ret retf）

我们改进一下子程序capital的设计：
capital : 
	push cx
	push si
change:
	mov cl,[si]
	mov ch,0
	jcxz ok
	and byte prt [si],11011111b
	inc si
	jmp short change 
ok :
	pop si
	pop cx
	ret
```
#### 实验10 编写子程序
1.显示字符串  只是显示字符串而已
```
assume cs:code,ds:data

data segment 
	db 'Welocme to masm!',0
data ends

code segment

start:  
	mov dh,8
	mov dl,3
	mov ax,data
	mov ds,ax
	mov si,0

	mov cx,02

	call show_str

	mov ax,4c00h
	int 21h

show_str:

	push ax
	push bx
	push cx
	push dx
	push bp
	push es


	mov ax,0
	mov al,160    ;每行160字节
	mov si,0

	mul dh        ;得到行数放入ax
	add dl,dl     ;列
	add al,dl     ;ax中存放最终位置
	mov bx,ax     ;最终位置传递给bx
	mov bp,cx     ;色彩编码

    s1:
	
	mov ax,47104  ;显示缓冲区地址
	mov es,ax    
	mov ch,0         
	mov cl,[si]  ;将内存中的数据读取，放入cl
	jcxz ok1     ;判断内存中是否数据为空

	mov es:[bx],cx   ;将数据放入缓冲区
	
	mov es:[bx+1],bp
	
	add bx,2
	inc si

	jmp short s1
   	
   ok1:
	pop es
	pop bp
	pop dx
	pop cx
	pop bx
	pop ax

	ret

code ends

end start
assume cs:code

code segment

start:  
	mov ax,0AAAAH    ;低位16位
	mov dx,0BBBBH    ;高位16位
	mov cx,0AH      ;除数
	call divdw 

	mov ax,4c00h
	int 21h

divdw:

	;除法防溢出公式：高位/低位= 取整（高位/除数）*65536+(取余（高位/除数）*65536+低位)/除数
	;X/N=int(H/N)*65536+[rem(H/N)*65536+L]/N
	;ax放低位 cx放余数 dx放高位 
	
	push bp
	push di
	push bx
	
	mov bp,ax            ;将低位16保存
	mov di,cx
	mov ax,dx           ;将被除数高位传送给ax
	mov dx,0
	div cx              ;ax/cx=ax

	mov cx,dx           ;将余数赋值给cx

	push ax             ;将商压入栈保存
	
	mov bx,65535        ;无法存储65536，超界
	mov ax,cx           ;将余数赋值给ax
	mul bx              ;余数与65535相乘
	jcxz ok             ;余数为0则不需要这些操作了
	add dx,1            ;高位进1（余数不是0的情况下x65536商必进1）

	add ax,cx           ;低位结果+余数，来代替65536，达到与乘以65536同样目的

ok:
	mov bx,bp           ;取出低位
	add ax,bx           ;乘积的低16位+被除数低16位
	mov bx,di
	div bx              ;计算结果，将商放入ax中
	mov cx,dx           ;余数放入cx中
	pop dx              ;高位商放入dx

	pop bx
	pop di
	pop bp

	ret 
	
code ends

end start
```
3.数值显示
数据/10得到余数，存储到内存中，显示到显示器
```
assume cs:code

code segment

data segment
	db 10 dup (0)
data ends


start:  
	
	mov ax,10
	mov bx,data
	mov ds,bx
	mov si,0
	call dtoc

	mov dh,8
	mov dl,3
	mov cl,2
	call show_str

	mov ax,4c00h
	int 21h

;---------------------------------------------------------------------------

dtoc:
	push ax
	push bx
	push si
	push cx

	mov di,0  ;计数器
s:
	
	mov cx,10     ;被除数
	call divdw

	mov si,0
	mov bx,30H
	add bx,cx      ;余数与30H相加得到ascii码
	
	push bx        ;存储字符
	inc di         ;计数
	mov cx,ax      ;商赋值给cx，判断商是否为0
	jcxz ok        ;判断商是否为0
	jmp short s

ok:
	
	mov cx,di
s3: 
	pop bx       ;将放入栈中的值逐个取出
	mov [si],bx  ;将值放入倒叙放入内存
	inc si
	loop s3
ok4:
	pop cx
	pop si
	pop bx
	pop ax
	ret 

;---------------------------------------------------------------------------

divdw:

	;除法防溢出公式：高位/低位= 取整（高位/除数）*65536+(取余（高位/除数）*65536+低位)/除数
	;X/N=int(H/N)*65536+[rem(H/N)*65536+L]/N
	;ax放低位 cx放余数 dx放高位 
	
	push bp
	push di
	push bx
	
	mov bp,ax            ;将低位16保存
	mov di,cx
	mov ax,dx           ;将被除数高位传送给ax
	
	div cl              ;ax/cl=ax

	mov dx,0            
	mov dl,ah           
	mov cx,dx           ;将余数赋值给cx
	mov ah,0            ;清除ax余数

	push ax             ;将商压入栈保存
	
	mov bx,65535        ;无法存储65536，超界
	mov ax,cx           ;将余数赋值给ax
	mul bx              ;余数与65535相乘
	jcxz ok2            ;余数为0则不需要这些操作了
	add dx,1            ;高位进1（余数不是0的情况下x65536商必进1）

	add ax,cx           ;低位结果+余数，来代替65536，达到与乘以65536同样目的

ok2:
	mov bx,bp           ;取出低位
	add ax,bx           ;乘积的低16位+被除数低16位
	mov bx,di
	div bx              ;计算结果，将商放入ax中
	mov cx,dx           ;余数放入cx中
	pop dx              ;高位商放入dx

	pop bx
	pop di
	pop bp

	ret 

;---------------------------------------------------------------------------
show_str:

	push ax
	push bx
	push cx
	push dx
	push bp
	push es


	mov ax,0
	mov al,160    ;每行160字节
	mov si,0

	mul dh        ;得到行数放入ax
	add dl,dl     ;列
	add al,dl     ;ax中存放最终位置
	mov bx,ax     ;最终位置传递给bx
	mov bp,cx     ;色彩编码

    s1:
	
	mov ax,47104  ;显示缓冲区地址
	mov es,ax    
	mov ch,0         
	mov cl,[si]  ;将内存中的数据读取，放入cl
	jcxz ok1     ;判断内存中是否数据为空

	mov es:[bx],cx   ;将数据放入缓冲区
	
	mov es:[bx+1],bp
	
	add bx,2
	inc si

	jmp short s1
   	
   ok1:
	pop es
	pop bp
	pop dx
	pop cx
	pop bx
	pop ax

	ret

code ends

end start

```