### 表达式以及数据类型
```
	0111 1111 = 127 
	算有符号最小数  : 添加符号位 取最大值反码    1111... 1000 0000 = -128  
	算无符号最大值  : 有符号最小数反码+1 去除符号位  0000....1111 1111 = 255  相当于有符号最大值 +1
	无符号类型超出表示范围 当前值%最大值余数   有符号结果是未定义的
	条件表达式是右结合率
** :: 域运算符    
	使用::域运算符可以指定局部变量还是全局变量
** wchar_t 宽字符类型 具体占用几个字节要看系统实现
** 强制转换
	C语言风格             cout << " avg = " << (double) total / num << endl;
	C++函数风格        cout << " avg = " << double (total) / num << endl;
	C++强转运算符     cout << " avg = " << static_cast<double>(total) / num << endl;
```
### 位运算
```
**>> <<
	较小的整数类型（char、short 以及 bool）会自动提升成 int 类型再做移位，得到的结果也是 int 类型
	左移运算符“<<”将操作数左移之后，在右侧补 0；
	右移运算符“>>”将操作数右移之后，对于无符号数就在左侧补 0；
	对于有符号数的操作则要看运行的机器环境，有可能补符号位，也有可能直接补 0；
	由于有符号数右移结果不确定，一般只对无符号数执行位移操作
**~ & | ^
	按位取反~: 一元运算符,类似逻辑非.对每个位取反,
	位与&: 二元运算符,类似逻辑与,两个数都是1才是1,其余情况0
	位或 | : 二元运算符,类似逻辑或.两个数只要有1就是1,其余未0
	位异或^: 两个数一样为0,不一样为1
```
### 复合数据类型
```
**vector
	数组是更加底层的数据类型,长度固定功能较少,安全性没有保证;性能更好,运行更高效.
	vector是模板类,是数组的上层抽象; 长度不定,功能强大; 缺点是运行效率较低 C++11新增一个array模板类,跟数组类似,长度固定,更加安全.
**string
	字符串数据类型string,能够表示长度可变的字符序列
	使用+号可以拼接字符串,这是算书院算符+的运算符重载 但是不可以两个字面值常量相加,因为字面值常量是char数组
** cin getline get
	cin 配合 >> 重载输入操作符 输入一个单词  跳过第一个空白符 读取到下一个空白符  剩下的字符会保存到"输入队列"
	getline(cin,string)  string引入    读取一行
	get  n=cin.get(); 捕获的字符返回   或者cin.get(n) 直接传递到n
** 读写文件
	ifstream <fstream>  IO库中提供了专门用于文件输入的ifstream类与文件输出ofstream  
	ifstream input("input.txt");  //读取 
	ofstream output("output.txt");//写入
	可以输出运算符<< 实现
	!!! ofstream output("input.txt"); 此文件会被清空
	ofstream output(FILENAME, ios::out | ios::app);    FILENAME 文件 ios::out 写入模式  ios::app  追加
	示例:  input >> word  单词读取  output << word  单词写入   读行getline(input,line)   写入output << line;   
逐词读取
	string word;
	while (input >> word)
	cout << word << endl;
逐行读取
	string line;
	while (getline(input, line))
	cout << line << endl;
逐字符读取
	char ch;
	while (input.get(ch))
	cout << ch << endl;
**enum 
	enum week
	{Mon, Tue, Wed, Thu, Fri, Sat, Sun}
	默认情况下，会将整数值赋给枚举量；
	枚举量默认从 0 开始，每个枚举量依次加 1；所以上面 week 枚举类型
	中，一周七天枚举量分别对应着 0~6 的常量值
```
### 指针
- 计算机内存分布是高位存储数据,低位补零
![[Pasted image 20230720163216.png|300]]
- 64位系统每一个指针保存的64位的 分配8字节
![[Pasted image 20230720163435.png | 300]]
```
**指针常量 
	指针也可以分为常量类型变量类型,指针常量就是 这个指针是常量类型 int* const p; 指向的地址无法改变
**常量指针
	指向常量的指针 const int *p; 指向一个常量
**指针函数 
	返回指针的函数  return p; 返回指针
**函数指针
	string stuInfo (const &string,int,double)
	string (* fp) (const &string,int,double) = nullptr;  //一个函数指针
	fp = &stuInfo();
	fp = stuInfo;  //和上面没区别
	使用:  
		*(fp)("hello", 1, 77.7)   
		fp("hello", 1, 77.7)
//指向常量的指针常量   可以指向变量与常量
	const int* const ccp = &i2;  常量 常量指针

**引用常量  引用本身是常量类型 指向变量 不能指向常量
	int& const f = b;
**常量引用  引用指向常量类型的数据
	 //const int& f1 = b;
	 const int& f1 = c;
	 const int& const fff 与 const int & f 等价 

**指针与数组
	int arr[] = { 1,2,3,4,5 };
**指针数组和数组指针
	int* arrp[5] = {&i,&b,&a,arr}; //指针数组  
**数组指针
	指向了数组的地址 int(*ap)[5] = &arr;
	int* array = new int[x + 1];  指向了数组第一个元素的指针
	cout << "arrp在内存中的长度为: " << sizeof(arrp) << endl;
	//本质是一个指针
	cout << "arrp2在内存中的长度为: " << sizeof(arrp2) << endl;
	cout << *arrp[0] << endl;
	
	arr本质上是一个int *类型的数组  //但是ap 是 int* 5指向数组类型的对象
	这里arr 代表的是第一个元素的地址  &arr代表数组的地址  虽然地址一样,但是含义不一样
	ap = &arr;   存储的是整个数组 解析数组地址(*arrp2)后得到数组元素第一个的地址
	cout << *ap << endl; 
	cout << arr << " + " << &arr << endl;
	加上括号 否则会直接两次解析成值而非地址则不能向后位移4位
	cout << *(*ap + 1) << endl;  //解析ap得到数组地址 数组地址+1移动4位,再次解析得到第二个值
	也可以直接使用输出数据 
	cout << *ap[n] << endl;
**  *ap 存放了数组每个元素的地址,*ap默认指向第一个值,可以取出后值  ap指向的是整个数组的地址,+1直接指向未知  
	 int (*ap) [5]  数组指针  里面存放了五个数组的地址
	 *ap+1代表数组指针后移
	 ap+1代表指向数组地址的指针后移 指向了一个未知空间

```
### 引用
```
**引用本质就是一个别名 
	int a = 10;
	int& ref = a; // ref是a的引用
	int& ref2; // 错误，引用必须初始化
	cout << "ref = " << ref << endl; // ref等于a的值
	cout << "a的地址为：" << &a << endl;
	cout << "ref 的地址为：" << &ref << endl; // ref 和 a 的地址完全一样
	ref = 20; // 更改ref相当于更改a
	int b = 26;
	ref = b; // ref没有绑定b，而是把b的值赋给了ref绑定的a    相当于修改了a的值 但是没有修改地址
**常量引用
	常量引用可以字面初始化,与变量几乎相同,但是不能修改值
	const int& a = 10;
**指针与引用
	ptr是一个指针 ptrf是一个指针引用
	int*& ptrf = ptr;
	不允许使用一个指向引用的指针 int&* ptr;
	应该这样  此时 ptr就是指向了i
	int &ref = i;
	int * ptr = &ref;
**引用在作为函数(string)参数时,无法接收字面量(字面量为char数组类型引用)参数. 需要将函数参数设置为const
**常量引用和普通变量的引用不同，它的初始化要求宽松很多，只要是可以转换成它指定类型的所有表达式，都可以用来做初始化

```
### 函数
```
1. 函数的返回值不能是数组和函数
2. 引用数组作为函数参数: 
	int(&arr)[6]  注: 范围for循环无法循环不知道指定长度的数组
1. 当一个函数被调用时候,调用的地方会创建一个临时变量拷贝返回值,但是如果在返回值类型后添加&,则返回引用  (sting &)
2. 返回数组指针的定义: int ( * fun(int x) )[5]  
3. 数组指针定义较为频繁 可以使用typedef来简化  typedef int arrayT[5]     arrayT *fun(int x);
4. 尾置返回类型  auto 自动推断返回值类型    auto fun3(int x) -> int(*)[5];
7. 返回类型是 数组指针 
	auto fun3(int x) -> int(*)[5] {}
	int(*fun(int x))[5] {}
	arrayT* fun(int x) {}   //typedef int arrayT[5];


```
### 函数高阶
```
inline 内联函数
	提高函数调用效率 编译器不做常规调用,直接在调用点进行内联展开
默认参数
	string stuInfo(string name = "未指定", int age = 18, double score = 60)  定义的实参后面必须也得定义
```
#### 参数匹配
```
**候选函数: 函数调用第一步就是确定候选函数
**可行函数:  函数调用时,优先调用匹配度最高的重载函数, 函数参数个数,是否需要类型转换等
**多参数: 逐渐比较每个参数
**二义性调用: 检查函数,优先级相同,无法调用
```
#### 函数指针
```
函数指针
	const string& (*fp) (const string&,const string&);
	fp = logerStr; //直接将函数名作为指针赋值给fp
	fp = &logerStr; //同上
	cout << fp("hello" , "world");
函数指针作为形参   函数本身不能作为形参使用
	void selectStr(const string&, const string&, const string & (const string&,const string&)); //函数类型
	void selectStr(const string&, const string&, const string & (*fp) (const string&,const string&)); //函数指针类型
	void selectStr(const string&, const string&, const string & fp(const string&,const string&)); //函数指针类型
定义类型别名
	typedef const string& Func(const string&, const string&); //函数类型
	typedef const string& (*Funcp)(const string&, const string&); //函数指针类型
	void selectStr(const string&,const string&, Func);
	void selectStr(const string&,const string&, Funcp);
使用C++11提供的更简单的decltype   提取定义好的函数类型
	typedef decltype(longerStr) Func2; //函数类型
	typedef decltype(longerStr)* FuncP2; //函数指针类型
	void selectStr(const string&, const string&,Func2);
函数指针作为返回值
	Func fun(int); //错误,不能使用函数返回函数类型
	Func* fun(int);  //返回函数指针类型
	Funcp fun(int); //返回定义好的函数指针类型
尾置返回类型
	auto fun3(int) -> Func; //错误,不能使用函数返回函数类型
	auto fun3(int) -> Func*;
	auto fun4(int) -> Funcp;
```
### 内存分区模型
```
代码区: 存放函数的二进制代码
	存放CPU执行的机器指令
	代码区是共享的,共享的目的是对于频繁被执行的程序,只需要在内存中有一份代码即可
	代码区是只读的,使其只读的原因是防止程序以外的修改了它的指令
全局区: 存放全局变量和静态变量以及常量
	全局变量和静态变量存放在此
	全局区还包含了常量区,字符串常量和其他常量也存放再此 (局部常量不在全局区)
	该区域的数据在程序结束后由操作系统释放
栈区: 由编译器自动分配释放,存放函数的参数值,局部变量等
	由编译器自动分配释放,存放函数的参数值,局部变量等
	注意事项: 不要返回局部变量的地址,栈区开辟的数据由编译器自动释放
堆区: 由程序员分配和释放,若程序员不释放,程序结束由操作系统回收
```