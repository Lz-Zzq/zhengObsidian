看,### 表达式以及数据类型
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
	void f1(int arr[]) {}
	void f2(int arr[8]) {}
	void f3(int(arr)[]) {}
	void f4(int(arr)[9]) {}
	void f5(int* arr) {}
	以上完全等价
3. 当一个函数被调用时候,调用的地方会创建一个临时变量拷贝返回值,但是如果在返回值类型后添加&,则返回引用  (sting &)
4. 返回数组指针的定义: int ( * fun(int x) )[5]  
5. 数组指针定义较为频繁 可以使用typedef来简化  typedef int arrayT[5]     arrayT *fun(int x);
6. 尾置返回类型  auto 自动推断返回值类型    auto fun3(int x) -> int(*)[5];
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
	通过new来在堆区开辟数据
	释放空间可以使用delete
new 操作符
	利用new在堆区开辟数据
	释放空间使用delete
	int* arr = new int[10];
	delete[] arr;

```
### 类与对象
```
构造函数: 主要作用域创建对象为属性赋值
	拷贝构造: Person(const Person& p) {}
	Person p1; 默认情况不需要带括号  带括号就会被编译器认为函数的声明
	Person(10); //匿名对象 
	Person(person);  //不要利用拷贝构造函数初始化匿名对象 编译器会认为 Person (person) === Person person   编译器会认为是对象的声明
	调用有参构造: Person per = 10 (隐式转换法)  Person per = Person(10)(显示法);  Person per(); 括号法(有参)
析构函数
	主要作用在对象销毁前系统自动调用,执行一些清理工作  语法: `~类名(){}`
	
深拷贝
	在堆区重新申请空间,进行拷贝操作
浅拷贝
	简单的赋值拷贝
		> 如果属性有在堆区开辟的，一定要自己提供拷贝构造函数，防止浅拷贝带来的问题
初始化列表
	Person(int a, int b, int c) :m_A(a), m_B(b), m_C(c) {}
类对象作为成员
	类对象作为成员,先调用对象的成员构造,在调用类构造
	调用析构时候先调用类析构在调用成员析构
静态成员
	静态成员变量
		所有对象共享同一份数据
		编译阶段分配内存
		类内声明,类外初始化
	静态成员函数
		所有对象共享一个函数
		静态成员函数只能访问静态成员变量
	成员变量与成员函数分开存储只有非静态变量才占用对象空间  静态成员,函数,非静态函数,都不占用对象空间
this指针
	this指针指向被调用成员函数所属的对象
const修饰成员函数
	成员函数添加const我们称之为常函数
	常函数内不可以修改成员属性
	成员属性声明时加关键字mutable后，在常函数中依然可以修改
常对象
	声明对象前加入const称之为常对象
	常对象只能调用常函数
友元
	friend  让一个函数或者类 访问另一个类中的私有成员
		全局函数做友元  friend 返回类型 函数名称与参数
		类做友元  friend class 类名称 
		成员函数做友元 friend 返回类型 类::函数名与参数
运算符重载
	加号运算符重载
		Person operator+(const Person& p)
	左移运算符重载
		ostream& operator<<(ostream& out, Person& p)
		ostream对象只能存在一个,需要连续输入需要返回ostream对象,接收参数需要接收ostream对象与类
	递增递减运算符重载
		前置++
			MyInteger& operator++()   先++在返回
		后置++
			MyInteger operator++(int) 先返回在++
	赋值运算符
		Person& operator=(Person &p)
		浅拷贝会带来重复释放问题,需要在赋值运算符中启用深拷贝来解决
	关系运算符重载
		bool operator!=(Person &p)
	重载函数调用运算符
		void operator()(string str)
		int operator()(int a,int b)
```
### 继承
```
继承语法
	语法  类 : 继承方式 父类
	继承方式: 公共(public) 保护(protected) 私有(private)
	子类会继承父类所有非静态成员变量
构造析构顺序
	先调用父类构造随后子类构造,析构相反
同名函数/变量(成员/静态) x
	同名x子类调用本类x,父类x会被子类隐藏 需要加::作用域符号来引用父类同名x
	同名函数可以使用对象调用方式或者类名直接访问方式  a.age a.B::age  B::fun()  A::B::fun()
c++多继承 class A : public B
	一个子类可以继承多个父类
棱形继承
	a类继承多个类,多个类又有同一个父类,a类获取父类变量时候每一份都是单独的,资源会被浪费
	 class Sheep : virtual public Animal{}   
	 class Tuo : virtual public Animal{}
	 class SheepTuo : public Sheep,public Tuo
	使用虚继承使用虚继承后多个重名的成员变量会变为一个
	使用虚继承后Sheep/Tuo继承的不在是单纯的父类成员变量,而是vbptr(虚基类指针),vbpter指向一个vbtable(虚基类表),vbpter加上偏移量之后可以找到该数据,该数据在多个类中只存在一份.共享的数据.
```
### 多态
```
**静态多态
	函数重载与运算符重载属于静态多态,复用函数名
**动态多态
	满足条件: 继承关系 子类重写父类虚函数
	派生类和虚函数实现运行时多态
-区别:
	静态多态的函数地址早绑定 - 编译阶段确定函数地址
	动态多态的函数地址晚绑定 - 运行阶段确定函数地址
** virtual 关键字
	virtual关键字可以在被声明的虚函数运行时选择合适的实际类型进行调用
	父类指针指向子类对象时
		子类继承父类重写父类函数时添加virtual关键字,可以启用多态行为
		否则依旧调用的是父类函数 
** 纯虚函数
	virtual 返回值类型 函数名  (参数列表) = 0;
	当一个类有了纯虚函数,这个类也称之为抽象类
** 抽象类
	无法实例化对象
	子类必须重写抽象类中的纯虚函数,否则也属于抽象类
**虚析构和纯虚析构
	多态使用时,如果子类中有属性开辟到堆区,那么父类指针释放时无法调用到子类的析构代码
	解决方式: 将父类中的析构函数改为虚析构或者纯虚析构
	**虚析构与纯虚析构共性:
		可以解决父类指针释放子类对象
		都需要有具体的函数实现
	**虚析构和纯虚析构区别:
		如果是纯虚析构,该类属于抽象类,无法实例化对象
	**虚析构语法
		virtual ~类名(){}
	**纯虚析构语法
		virtual ~类名() = 0;
		类名::~类名(){}
	注意: 纯虚析构会让本类成为抽象类无法实例化,纯虚析构应该在类外声明析构中的代码,子类未重写父类纯虚函数的话也会成为抽象类
	总结
		1.虚析构或纯虚析构就是用来解决通过父类指针释放子类对象
		2.如果子类中没有堆数据,可以不写虚析构与纯虚析构
		3.拥有纯虚析构函数的类也属于抽象类
**多态原理
	一个空类占用1  函数加上virtual关键字占用4字节 加上关键字之后会存在一个虚函数指针
	虚函数指针vfptr会指向虚函数表vftable,表内记录了被virtual修饰的函数地址,当没有重写时,Cat类内部函数地址为&Animal::speak
	当重写之后,会出现多态现象&Cat::speak
```
![[Pasted image 20231106195506.png|700]]
## 5 文件操作
程序运行时产生的数据都属于临时数据，程序一旦运行结束都会被释放
通过**文件可以将数据持久化**
C++中对文件操作需要包含头文件 \<fstream>
文件类型分为两种：
1. **文本文件**     -  文件以文本的**ASCII码**形式存储在计算机中
2. **二进制文件** -  文件以文本的**二进制**形式存储在计算机中，用户一般不能直接读懂它们
操作文件的三大类:
1. ofstream：写操作
2. ifstream： 读操作
3. fstream ： 读写操作
4. 
### 5.1文本文件
#### 5.1.1写文件
写文件步骤如下：
1.  包含头文件
    \#include \<fstream>
2. 创建流对象
    ofstream ofs;
3. 打开文件
    ofs.open("文件路径",打开方式);
4. 写数据
    ofs << "写入的数据"
1. 关闭文件
    ofs.close();
文件打开方式：

| 打开方式    | 解释                       |
| ----------- | -------------------------- |
| 11          | 11                         |
| ios::in     | 为读文件而打开文件         |
| ios::out    | 为写文件而打开文件         |
| ios::ate    | 初始位置：文件尾           |
| ios::app    | 追加方式写文件             |
| ios::trunc  | 如果文件存在先删除，再创建 |
| ios::binary | 二进制方式                 |

**注意：** 文件打开方式可以配合使用，利用|操作符
**例如：**用二进制方式写文件 `ios::binary |  ios:: out`

### 5.1.2读文件
读文件与写文件步骤相似，但是读取方式相对于比较多
读文件步骤如下：
1. 包含头文件
    #include \<fstream>
2. 创建流对象
    ifstream ifs;
3. 打开文件并判断文件是否打开成功
    ifs.open("文件路径",打开方式);
4. 读数据
    四种方式读取
5. 关闭文件
    ifs.close();
总结：
- 读文件可以利用 ifstream  ，或者fstream类
- 利用is_open函数可以判断文件是否打开成功
- close 关闭文件 
- 
### 5.2 二进制文件
以二进制的方式对文件进行读写操作
打开方式要指定为 ==ios::binary==
#### 5.2.1 写文件
二进制方式写文件主要利用流对象调用成员函数write
函数原型 ：`ostream& write(const char * buffer,int len);`
参数解释：字符指针buffer指向内存中一段存储空间。len是读写的字节数

总结：
* 文件输出流对象 可以通过write函数，以二进制方式写数据

#### 5.2.2 读文件
二进制方式读文件主要利用流对象调用成员函数read
函数原型：`istream& read(char *buffer,int len);`
参数解释：字符指针buffer指向内存中一段存储空间。len是读写的字节数
文件输入流对象 可以通过read函数，以二进制方式读数据
```
class Person 
public:
	char name[64];
	int age;
write 
	ofstream ofs("person.txt", ios::out | ios::binary);
	//ofs.open("person.txt",ios::out | ios::binary)
	Person p = { "张三",18 };
	//读取当前对象内存地址 写入数据到当前地址中
	ofs.write((const char*)&p,sizeof(p));
	ofs.close();
read
	Person p1;
	ifstream ifs("person.txt", ios::in | ios::binary);
	ifs.read((char *)&p1,sizeof(p1));
	cout << p1.age << " " << p1.name << endl;
```

### 模板
#### 函数模板
- C++ 泛型编程 主要利用技术就是模板
- C++ 提供两种模板机制: 函数模板和类模板
```
template<typename T>
函数声明或者定义
	template --声明创建模板
	typename --表面其后面的符号是一种数据类型,可以用class代替
	T 通用数据类型
模板不能单独使用,如果需要单独使用必须指定类型
```
- 普通函数与函数模板的区别
	 1. 普通函数调用时可以发生自动类型转换（隐式类型转换）
	 2. 函数模板调用时，如果利用自动类型推导，不会发生隐式类型转换
	 3. 如果利用显示指定类型的方式，可以发生隐式类型转换
- 普通函数与函数模板的调用规则
	1. 如果函数模板和普通函数都可以实现，优先调用普通函数
	2. 可以通过空模板参数列表来强制调用函数模板
	3. 函数模板也可以发生重载
	4. 如果函数模板可以产生更好的匹配,优先调用函数模板
- 具体化模板
	 1. 显示具体化的原型和定意思以template<>开头，并通过名称来指出类型
	 2. 具体化优先于常规模板
		template<> bool myCompare(Person &p1, Person &p2)
#### 类模板
- 建立一个通用类，类中的成员 数据类型可以不具体制定，用一个虚拟的类型来代表
>template\<typename T>
>类
>template<class NameType, class AgeType>
>class Person
- 类模板与函数模板的区别
	1. 类模板没有自动类型推导的使用方式
	2. 类模板在模板参数列表中可以有默认参数
	> template(class NameTyep, class AgeType = int )  默认int
- 类模板中成员函数创建时机
	1. 普通类中的成员函数一开始就可以创建
	2. 类模板中的成员函数在调用时才创建
- 类模板对象做函数做参数
	1. 指定传入的类型    直接显示对象的数据类型
	```
	void printPerson1(Person<string,int> &p)
	```
	2. 参数模板化           将对象中的参数变为模板进行传递
	```
	template<class T1,class T2>   
	void printPerson2(Person<T1, T2>& p)
	```
	3. 整个类模板化        将这个对象类型 模板化进行传递
	```
	template<class T>
	void printPerson3(T &p)
	```
#### 类模板与继承
- 当子类继承的父类是一个类模板时，子类在声明的时候，要指定出父类中T的类型
- 如果不指定，编译器无法给子类分配内存
- 如果想灵活指定出父类中T的类型，子类也需变为类模板
```
template<class T>
class Base

//直接声明父类中的T的数据类型
class Son :public Base<int>

//如果想要灵活的指定父类中的T的类型,子类也需要变为类模板
template<class T1,class T2>
class Son2 : public Base<T2> {
	T1 obj;
};
```
#### 类模板成员函数类外实现
```
//类模板外实现构造函数
template<class T1,class T2>
Person<T1, T2>::Person(T1 name, T2 age) {

//类模板外实现成员函数
template<class T1,class T2>
void Person<T1, T2>::showPerson1() {
```
#### 类模板分文件编写
- 类模板中成员函数创建时机是在调用阶段，导致分文件编写时链接不到
>解决方式1：直接包含.cpp源文件
>解决方式2：将声明和实现写到同一个文件中，并更改后缀名为.hpp，hpp是约定的名称，并不是强制
```
//直接包含源文件
#include "person.cpp"
//将声明与实现写到同一文件中,更改后缀名为.hpp
#include "person.hpp"
```
#### 类模板与友元
- 全局函数类内实现 - 直接在类内声明友元
```
//普通函数声明
friend void printPerson(Person001<T1, T2> p) {
	cout << "姓名: " << p.m_Name << "年龄: " << p.m_Age << endl;
}
```
- 全局函数类外实现 - 需要提前让编译器知道全局函数的存在
```
//声明类,让编译器看到   建议
template<class T1, class T2>
class Person;

//方法实现   函数模板实现
template<class T1, class T2>
void printPerson(Person001<T1, T2> p) {
	cout << "姓名: " << p.m_Name << "年龄: " << p.m_Age << endl;
}

//类外声明函数 需要加上<> 证明该函数是模板 
//类内不需要使用模板是因为普通函数接收了一个模板对象,而本函数在外部声明,需要加上<>声明为函数模板
friend void printPerson<>(Person001<T1, T2> p);




```
## 6 STL
#### STL基本概念
- STL (Standard Template Library,标准模板库)
- STL 从广义上分为: <b>容器(container)算法(algorithm) 迭代器(iterator)</b>
- 容器和算法之间通过迭代器进行无缝来连接
- STL几乎所有的代码都采用了模板类或者模板函数
#### STL六大组件
- <b> 容器 算法 迭代器 仿函数 适配器(配接器) 空间配置器</b>
  1. 容器: 各种数据结构,vector list deque set map 用来存放数据
  2. 算法: 各种常用的算法 sort find copy foreach等
  3. 迭代器: 扮演了容易与算法之间的胶合剂
  4. 仿函数: 行为类似函数,可作为算法的某种策略
  5. 适配器: 一种用来修饰容器或者仿函数或迭代器接口的东西
  6. 空间适配器: 负责空间的配置与管理
#### STL中容器算法迭代器
- <b>容器</b>  序列式容器与关联式容器
    > 序列式 : 强调值的排序,容器中每个元素都有自己的固定位置
    > 关联式 : 二叉树结构,各个元素之间没有严格上的物理关系
- <b>算法</b> 质变算法与非质变算法
    > 质变算法 : 运算过程中会更改区间内元素的内容 拷贝,替换,删除等
    > 非质变算法 : 运算过程中不会更改区间内的元素内容,查找,遍历计数等

- 迭代器 容器和算法之间的粘合剂
![[Pasted image 20240701105414.png]]
常用的容器中迭代器种类为双向迭代器，和随机访问迭代器

#### 容器算法迭代器初始
##### vector 存放内置数据类型
