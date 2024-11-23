# 第一章 数据库的概述
#### 表，记录，字段
- E-R（entity-relationship,实体-联系）模型中有三个主要的概念：实体集，属性，联系集
- 一个实体集（class），对应于数据库中的一个表（table），一个实体（instance）则对应于数据库表中的一行（row），也成为一条记录（record）。一个属性（attribute）对应于数据库表中的一列（column），也称之为一个字段（field）。
![[Pasted image 20241027212129.png|300]]
```
ORM思想 (Object Relational Mapping)体现：
数据库中的一个表 <---> Java或Python中的一个类
表中的一条数据 <---> 类中的一个对象（或实体）
表中的一个列 <----> 类中的一个字段、属性(field)
```
#### 表的关联关系
表与表之间的数据记录有四种：
**1. 一对一关联**
实际开发中应用不多，因为一对一可以创建成一张表
例：设计表：学号，姓名，手机号，班级，系别，身份证，住址，籍贯，联系人
拆分为两个表：两个表的记录是一一对应关系
- 基础信息：学号，姓名，手机号，班级，系别
- 档案信息：学号，身份证，住址，籍贯，联系人
==两种建表原则==：
- ==外键唯一：主表的主键和从表的外键（唯一），形成主外键关系，外键唯一。==
- ==外键是主键：主表的主键和从表的主键，形成主外键关系。==![[Pasted image 20241027205023.png|300]]
**2. 一对多关系**
- 举例：客户表和订单表，分类表和商品表，部门表和员工表
	- 员工表：编号，姓名，所属部门
	- 部门表：编号，名称，简介
- ==一对多建表原则==：==在从表（多方）创建一个字段，字段作为外键指向主表（一方）的主键==![[Pasted image 20241027205108.png|300]]![[Pasted image 20241027205128.png|300]]
**3. 多对多的关系**
- 要表示多对多关系，==必须创建第三个表==，该表通常称为**链接表**，他将多对多关系划分为两个一对多关系。将这两个表的主键都插入到第三个表中。![[Pasted image 20241027205246.png|300]]
- 举例：学生-课程
  - 学生信息表：一行代表一个学生的信息（学号，姓名，手机号码，班级，系别）
  - 课程信息表：一行代表一个课程的信息（课程编号，授课老师，简介...）
  - 选课信息表：一个学生可以选多门课，一门课可以被多个学生选择
```
学号      课程编号
1           1001
2           1001
1           1002
```
- 举例：产品-订单
  “订单”表和“产品”表有一种多对多的关系，这种关系是通过与“订单明细”表简历两个一对多关系来定义的。一个订单可以有多个产品，每个产品可以出现在多个订单中。
  - 产品表：“产品”表中的每条记录表示一个产品
  - 订单表：“订单”表中每条记录表示一个订单
  - 订单明细表：==每个产品可以与“订单”表中的多条记录对应，即出现在多个订单中。一个订单可以与“产品”表中的多条记录对应，即包含多个产品==![[Pasted image 20241027205921.png]]
- 举例：用户-角色
- 多对多建表原则：==需要创建第三张表，中间表中至少两个字段，这两个字段分别作为外键指向各自一方的主键==![[Pasted image 20241027211054.png|300]]
**4. 自我引用**
表内的自我引用
![[Pasted image 20241027211741.png|300]]
# 第二章 数据库环境搭建
[数据库环境搭建](D:\User\桌面\MySQL\第02章_MySQL环境搭建.pdf)
# 第三章 基本的SELECT语句
### 1.SQL分类

SQL语言在功能上主要分入三大类：
- <font color="yellow">DDL (Data Definition Languages,数据定义语言)</font>，这些语句定义了不同的数据库，表，视图，索引等数据库对象，还可以用来创建，删除，修改数据库和数据表的结构。
  - 主要的语句关键字包括<font color="yellow">CREATE DROP ALTER</font>等。
- <font color="yellow">DML (Data Manipulation Language 数据操作语言)</font>，用于添加，删除，更新查询数据库记录，并且检查数据完整性。
  - 主要语句关键字包括<font color="yellow">INSERT DELETE UPDATE SELECT</font>等。
  - SELECT是SQL语言的基础，最为重要
- <font color="yellow">DCL （Data Control Language 数据控制语言）</font>，用于定义数据库，表，字段，用户的访问权限和安全级别。
  - 主要的语句关键字包括<font color="yellow">GRANT REVOKE COMMIT ROLLBACK SAVEPOINT</font>等。
 ```
 因为查询语句使用的非常频繁，所以很多人把查询语句单独拎出来：DQL（数据查询语言）。
 还有单独将COMMIT ROLLBACK取出来称之为TCL（Transaction Control Language 事务控制语言）。
```
### 2.SQL大小写规范

MySQL 在 Windows 环境下是大小写不敏感的
MySQL 在 Linux 环境下是大小写敏感的

推荐采用统一的书写规范：
数据库名、表名、表别名、字段名、字段别名等都小写
SQL 关键字、函数名、绑定变量等都大写
#### 注释
```
单行注释：#注释文字(MySQL特有的方式)
单行注释：-- 注释文字(--后面必须包含一个空格。)
多行注释：/* 注释文字 */
```
#### 数据指令导入
`source d:\mysqldb.sql`
### 3.基本的SELECT语句
**SELECT**
```
SELECT 1;没有任何子句
SELECT 9/2;#没有任何子句
```
**SELECT...FORM**
```
SELECT 标识选择哪些列
FROM 标识从哪个表中选择
```
选择全部列
```
SElECT * FROM departments;  一般情况下我们不使用SELECT*
```
选择特定的列
```
SELECT department_id, location_id
FROM departments;
```
#### 列的别名
可以使用as 或者不使用
```
SELECT last_name AS name, commission_pct comm
FROM employees;
空格应该添加双引号
SELECT last_name "Name", salary*12 "Annual Salary"
FROM employees;
```
#### 去除重复行
DISTINCT
默认情况下，查询会返回全部行，包括重复行
```
SELECT DISTINCT department_id 
FROM employees;
```
有两点需要注意
1. DISTINCT 需要放到所有列名的前面，如果写成 SELECT salary, DISTINCT department_id
FROM employees 会报错。
2. DISTINCT 其实是对后面所有列名的组合进行去重，你能看到最后的结果是 74 条，因为这 74 个部门id不同，都有 salary 这个属性值。如果你想要看都有哪些不同的部门（department_id），只需要写 DISTINCT department_id 即可，后面不需要再加其他的列名了。
   
#### 空值运算符
- 所有运算符或者列值遇到null值，运算结果都为null
```sql
select employee_id,salary,commission_pct,
12 * salary * (1 + commission_pct) "annual_sal"
from employees;
```
MySQL里面，空值不等于空字符串。一个空字符串的长度是0，空值长度是空，空占用空间
#### 着重号
错误的
```sql
mysql> SELECT * FROM ORDER;
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that
corresponds to your MySQL server version for the right syntax to use near 'ORDER' at
line 1
```
正确的
```sql
mysql> SELECT * FROM `ORDER`;
mysql> SELECT * FROM `order`;
```
如果我们的字段，表名与mysql保留字相同，需要使用着重号''

#### 查询常数
SELECT 查询还可以对常数进行查询，在SELECT查询结果中增加一列固定的常数列。==这列的取值是我们指定的，而不是数据表中动态取出的==
为什么要对常数查询？
SQL中的SELECT语法的确提供了这个功能，一般来说我们只从一个表中查询数据，通常不需要增加一个固定的常数列，但如果我们向整合不同的数据源，用常数列作为这个表的标记，就需要查询这个常数。
比如说，我们相对employees数据表中的员工姓名进行查询，同时增加一列字段corporation，这个字段固定值为“尚硅谷”，可以这样写
```sql
select '尚硅谷' as corporation, last_name from employees;
```
### 4.显示表结构
DESCRIBE 或者DESC命令
```sql
describe employees;
desc employees;
```
![[Pasted image 20241103174926.png|400]]
Field：标识字段名称
Type：表示字段类型，这里barcode,goodsname是文本类型的，price是整数类型的
Null表示该列是否可以存储NULL值
Key：表示该列是否已编制索引。PRI表示该列是表主键的一部分；UNI表示该列是UNIQUE索引的一部分；MUL表示在列中某个给定值允许出现多次
Default：表示该列是否又默认值，如果有，那么值是多少
Extra：表示可以获取与给定列有关的附加信息，列入AUTO_INCREMENT等。
### 5.过滤数据
WHERE
语法：
```sql
SELECT 字段1,字段2
FROM 表名
WHERE 过滤条件
```
列，取出部门号90所有员工数据
```sql
SELECT * FROM employees
WHERE department_id=90;
```


# 第四章 运算符
![[Pasted image 20241103181229.png|500]]
### 1.算数运算符
#### 加法减法
- 一个整数类型的值对整数进行加法和减法操作，结果还是一个整数；
- 一个整数类型的值对浮点数进行加法和减法操作，结果是一个浮点数；
- 加法和减法的优先级相同，进行先加后减操作与进行先减后加操作的结果是一样的；
在Java中，+的左右两边如果有字符串，那么表示字符串的拼接。==但是在MySQL中+只表示数值相加。如果遇到非数值类型，先尝试转成数值，如果转失败，就按0计算。（补充：MySQL中字符串拼接要使用字符串函数CONCAT()实现）==
![[Pasted image 20241103194350.png]]
#### 乘法除法
- 一个数乘以整数1和除以整数1后仍得原数；
- 一个数乘以浮点数1和除以浮点数1后变成浮点数，数值与原数相等；
- ==一个数除以整数后，不管是否能除尽，结果都为一个浮点数；==
- ==一个数除以另一个数，除不尽时，结果为一个浮点数，并保留到小数点后4位==；
- 乘法和除法的优先级相同，进行先乘后除操作与先除后乘操作，得出的结果相同。
- 在数学运算中，0不能用作除数，<font color="yellow">在MySQL中，一个数除以0为NULL</font>。![[Pasted image 20241103194427.png]]
#### 求模（求余）运算符
```sql
select 12%3, 12 mod 5 from dual;
```
列：取出id偶数员工
```sql
select * from employees where employee_id % 2 = 0
```
### 2.比较运算符
比较运算符用来对表达式左边的操作数和右边的操作数进行比较，比较的结果为真则返回1，比较的结果为假则返回0，其他情况则返回NULL。
![[Pasted image 20241103182653.png | 500]]
#### 等号运算符
判断两边表达式，字段,值是否相等,相等返回1，否则返回0
使用等号运算符有如下规则：
- 两边值字符串表达式都为字符串，则MySQL按照字符串比较，比较的是每个字符串中字符ANSI编码。
- 两边都是整数，则MySQL会按照整数来比较。
- 一个整数一个字符串，将字符串转为数字进行比较。
- ==如果有一个为NULL，则结果为NULL。==
- <font color="yellow">任何无法解析的字符串会被视为0,列入字符串'a','b'等，他们与数字0相等</font>
![[Pasted image 20241103193517.png]]![[Pasted image 20241103193529.png]]
#### 安全等于运算符
安全等于运算符==（<=>）==与=的区别是可以对NULL进行判断。<font color="yellow">两个操作数均为NULL时，返回值为1，而不是NULL；当一个操作数为NULL时，返回值为0，而不为NULL。 </font>
![[Pasted image 20241103193430.png]]
==两个NULL比较为1，一个NULL比较为0。==
列：查询commission_pct为0.4的数据
如果查询commission_pct为NULL的数据呢？
```sql
select * from employees where commission_pct = 0.40
使用=无法查询到NULL的数据，因为使用=查询commission_pct为NULL，结果也为NULL
SELECT * FROM employees WHERE commission_pct <=> NULL
我们使用<=>比较时，条件为NULL，表中数据为NULL，则返回1，就返回了数据 
可能 WHERE是返回1查询成功,0失败？
```
#### 不等于运算符
不等于运算符（<> !=）用于判断两边数字，字符串，表达式值是否不相等，如果不想当返回1，相等返回0。不等于运算符不能判断null值。如果两边的值有任意一个为NULL，或者两边都NULL，则结果NULL。
此外，还有非符号运算符
![[Pasted image 20241103191622.png|500]]
#### 空运算符
空运算符（IS NULL或者ISNULL）判断一个值是否为NULL，如果为NULL则返回1，否则返回
0。
```sql
SELECT NULL IS NULL, ISNULL(NULL), ISNULL('a'), 1 IS NULL;
```
![[Pasted image 20241103193328.png | 400]]
比较commission_pct等于NULL的四种写法
```sql
SELECT * FROM employees WHERE commission_pct IS NULL ;
SELECT * FROM employees WHERE ISNULL(commission_pct) ;
SELECT * FROM employees WHERE commission_pct <=> NULL;
SELECT * FROM employees WHERE commission_pct = NULL ;
```
#### 非空运算符 
非空运算符 非空运算符（IS NOT NULL）判断一个值是否不为NULL，如果不为NULL则返回1，否则返回0。 
```sql
SELECT NULL IS NOT NULL, 'a' IS NOT NULL, 1 IS NOT NULL;
```
![[Pasted image 20241103193311.png | 400]]
查询commission_pct不等于NULL
```sql
select * from employees where commission_pct is not null
SELECT * FROM employees WHERE not commission_pct <=> NULL
SELECT * FROM employees WHERE not isnull(commission_pct)  
```

#### 最小值运算符
语法格式为：==LEAST(值1，值2，...，值n)==。其中，“值n”表示参数列表中有n个值。在有
两个或多个参数的情况下，返回最小值。
```sql
SELECT LEAST (1,0,2), LEAST('b','a','c'), LEAST(1,NULL,2);
```
![[Pasted image 20241103193243.png|400]]
- 当参数是整数或者浮点数时，LEAST将返回其中最小的值；
- 当参数为字符串时，返回字母表中顺序最靠前的字符；
- 当比较值列表中有NULL时，不能判断大小，返回值为NULL。
#### 最大值运算符 
语法格式为：==GREATEST(值1，值2，...，值n)==。其中，n表示参数列表中有n个值。当有
两个或多个参数时，返回值为最大值。假如任意一个自变量为NULL，则GREATEST()的返回值为NULL。
```sql
SELECT GREATEST(1,0,2), GREATEST('b','a','c'), GREATEST(1,NULL,2); 
```
![[Pasted image 20241103200227.png | 500]]

- 当参数中是整数或者浮点数时，GREATEST将返回其中最大的值；
- 当参数为字符串时，返回字母表中顺序最靠后的字符；
- 当比较值列表中有NULL时，不能判断大小，返回值为NULL。
#### BETWEEN AND运算符 
BETWEEN运算符使用的格式通常为SELECT D FROM TABLE WHERE C BETWEEN A
AND B，此时，当C大于或等于A，并且C小于或等于B时，结果为1，否则结果为0。
```sql
SELECT 1 BETWEEN 0 AND 1, 10 BETWEEN 11 AND 12, 'b' BETWEEN 'a' AND 'c';
```
![[Pasted image 20241103200506.png]]
查询工资2500-3500之间（包括）的数据
```sql
SELECT last_name, salary
FROM employees
WHERE salary BETWEEN 2500 AND 3500;
```
#### IN运算符
IN运算符用于判断给定的值是否是IN列表中的一个值，如果是则返回1，否则返回0。如果给
定的值为NULL，或者IN列表中存在NULL，则结果为NULL。
```sql
 SELECT 'a' IN ('a','b','c'), 1 IN (2,3), NULL IN ('a','b'), 'a' IN ('a', NULL);
```
![[Pasted image 20241103201514.png]]
查询manager_id中是否包含以下三个数
```sql
select * from employees where manager_id in (100,101,102)
```
#### NOT IN运算符
NOT IN运算符用于判断给定的值是否不是IN列表中的一个值，如果不是IN列表中的一
个值，则返回1，否则返回0。
```sql
SELECT 'a' NOT IN ('a','b','c'), 1 NOT IN (2,3);
```
![[Pasted image 20241103201818.png |400]]

#### LIKE运算符 
LIKE运算符主要用来匹配字符串，通常用于模糊匹配，如果满足条件则返回1，否则返回
0。如果给定的值或者匹配条件为NULL，则返回结果为NULL。
通配符
```
“%”：匹配0个或多个字符。
“_”：只能匹配一个字符。
```
SQL语句
```sql
SELECT NULL LIKE 'abc', 'abc' LIKE NULL;
```
![[Pasted image 20241103230220.png]]
```sql
第一个字母带有S的
select first_name from employees where first_name like 'S%' 
带有S的
select first_name from employees where first_name like '%S%' 
第二个字母为o的
select first_name from employees where first_name like '_o%'
第三个字母为o的
select first_name from employees where first_name like '__o%'
```
#### ESCAPE(逃避)
回避特殊符号的：使用转义符。例如：将\[%]转为\[\$%]、\[]转为\[\$]，然后再加上\[ESCAPE‘$’]即可。
```sql
SELECT job_id
FROM jobs
WHERE job_id LIKE 'IT\_%';  将_转义，_就是_而不是通配符
```
如果使用\表示转义，要省略ESCAPE。如果不是\，则要加上ESCAPE。
```sql
SELECT job_id
FROM jobs
WHERE job_id LIKE 'IT$_%' ESCAPE '$'; 
```
#### REGEXP运算符
REGEXP运算符用来匹配字符串，语法格式为： expr REGEXP 匹配条件 。如果expr满足匹配条件，返回1；如果不满足，则返回0。若expr或匹配条件任意一个为NULL，则结果为NULL。
通配符
```
（1）‘^’匹配以该字符后面的字符开头的字符串。
（2）‘$’匹配以该字符前面的字符结尾的字符串。
（3）‘.’匹配任何一个单字符。
（4）“[...]”匹配在方括号内的任何字符。例如，“[abc]”匹配“a”或“b”或“c”。为了命名字符的范围，使用一个‘-’。“[a-z]”匹配任何字母，而“[0-9]”匹配任何数字。
（5）‘*’匹配零个或多个在它前面的字符。例如，“x*”匹配任何数量的‘x’字符，“[0-9]*”匹配任何数量的数字，而“*”匹配任何数量的任何字符
```
SQL语句
```sql
^s 表示查看是否s开头   t$是否t结尾  hk则是否存在hk
SELECT 'shkstart' REGEXP '^s', 'shkstart' REGEXP 't$', 'shkstart' REGEXP 'hk';
```
![[Pasted image 20241103233527.png]]
```sql
gu.gu .代表任何字符  [ab]代表是否存在a-b之间（包括的字符）数字同理
 SELECT 'atguigu' REGEXP 'gu.gu', 'atguigu' REGEXP '[ab]';
```
![[Pasted image 20241103233544.png]]
### 3.逻辑运算符
逻辑运算符主要用来判断表达式的真假，在MySQL中，逻辑运算符的返回结果为1、0或者NULL。
MySQL中支持4种逻辑运算符如下：
![[Pasted image 20241103234843.png]]

#### 逻辑非运算符 逻辑非（NOT或!）
运算符表示当给定的值为0时返回1；当给定的值为非0值时返回0；当给定的值为NULL时，返回NULL。
```sql
SELECT NOT 1, NOT 0, NOT(1+1), NOT !1, NOT NULL;
```
![[Pasted image 20241105163932.png]]

#### 逻辑与运算符 逻辑与（AND或&&）
运算符是当给定的所有值均为非0值，并且都不为NULL时，返回1；当给定的一个值或者多个值为0时则返回0；否则返回NULL。
```sql
SELECT 1 AND -1, 0 AND 1, 0 AND NULL, 1 AND NULL;
```
![[Pasted image 20241105164320.png]]
当第一个条件成立则成立，第一个不成立则第二个条件成立

#### 逻辑或运算符 逻辑或（OR或||）
运算符是当给定的值都不为NULL，并且任何一个值为非0值时，则返
回1，否则返回0；当一个值为NULL，并且另一个值为非0值时，返回1，否则返回NULL；当两个值都为NULL时，返回NULL。
![[Pasted image 20241105164840.png]]
两个条件必须都为真，否则有一个不为真那么结果就为假
查询基本薪资不在9000-12000之间的员工编号和基本薪资
```sql
SELECT employee_id,salary FROM employees WHERE NOT salary BETWEEN 9000 AND 12000
SELECT employee_id,salary FROM employees WHERE salary < 9000 OR salary >12000
SELECT employee_id,salary FROM employees WHERE NOT (salary < 9000 AND salary >12000)
```
==为什么NOT(salary < 9000 AND salary >12000) 能达到相同的目的呢，因为这句话一定为假，但是加上NOT之后取反，一定为真，则列出所有符合条件的数据==

OR可以和AND一起使用，但是在使用时要注意两者的优先级，。<font color="yellow">由于AND的优先级高于OR。</font>，==因此先对AND两边的操作数进行操作，再与OR中的操作数结合。==

#### 逻辑异或运算符 逻辑异或（XOR）
==运算符是当给定的值中任意一个值为NULL时，则返回NULL；==如果两个非NULL的值都是0或者都不等于0时，则返回0；如果一个值为0，另一个值不为0时，则返回1。
![[Pasted image 20241105170253.png]]
==有NULL为NULL，两值一个0一个不是0返回1，两个值都是0或者都不等于0，返回0。==
<font color='yellow'>不考虑null。两个值一个0，另一个 "?" ，才会返回1，否则一定返回0</font>
### 4.位运算符
位运算符是在二进制数上进行计算的运算符。位运算符会先将操作数变成二进制数，然后进行位运算，最后将计算结果从二进制变回十进制数。
![[Pasted image 20241105172034.png]]
#### 按位与运算符 按位与（&）
运算符将给定值对应的二进制数逐位进行逻辑与运算。当给定值对应的二进制位的数值都为1时，则该位返回1，否则返回0。
![[Pasted image 20241105172156.png]]
==都是1返回1==
1的二进制0001 10的二进制1010
因为对应数值都为1的情况没有，则返回0000
20二进制10100 30二进制11110
结果为10100
两个对应数值都为1，则成立，返回20
#### 按位或运算符 按位或（|）
运算符将给定的值对应的二进制数逐位进行逻辑或运算。当给定值对应的
二进制位的数值有一个或两个为1时，则该位返回1，否则返回0。
![[Pasted image 20241105172633.png]]
==有1则返回1==
1的二进制0001 10的二进制1010
1011,则返回11
20二进制10100 30二进制11110
11110，返回30
#### 按位异或运算符 按位异或（^）
运算符将给定的值对应的二进制数逐位进行逻辑异或运算。当给定值对应的二进制位的数值不同时，则该位返回1，否则返回0。
![[Pasted image 20241105173112.png]]
==不同返回1，相同返回0==
1的二进制0001 10的二进制1010
1011,返回11
20二进制10100 30二进制11110
01010，返回10
#### 按位取反运算符 按位取反（~）
运算符将给定的值的二进制数逐位进行取反操作，即将1变为0，将0变为1。
![[Pasted image 20241105173512.png]]
0001取反1110
1010  & 1 = 1010 & 1110 = 1010 = 10
==按位取反（~）运算符的优先级高于按位与（&）==
#### 按位右移运算符 按位右移（>>）
运算符将给定的值的二进制数的所有位右移指定的位数。右移指定的位数后，右边低位的数值被移出并丢弃，左边高位空出的位置用0补齐。
![[Pasted image 20241105174100.png]]
1的二进制数为0000 0001，右移2位为0000 0000，对应的十进制数为0。
4的二进制数为0000 0100，右移2位为0000 0001，对应的十进制数为1。

#### 按位左移运算符 按位左移（<<）
运算符将给定的值的二进制数的所有位左移指定的位数。左移指定的位数后，左边高位的数值被移出并丢弃，右边低位空出的位置用0补齐。![[Pasted image 20241105175355.png]]1的二进制数为0000 0001，左移两位为0000 0100，对应的十进制数为4。
4的二进制数为0000 0100，左移两位为0001 0000，对应的十进制数为16。
### 5.运算符的优先级
![[Pasted image 20241105175438.png|500]]
### 拓展：使用正则表达式查询
![[Pasted image 20241105175650.png | 500]]
# 第五章 排序与分页
### 排序循序
#### 排序规则
<font color='yellow'>使用order by 进行排序</font>
- ASC 升序
- DESC 降序
<font color='yellow'>order by 在select语句的结尾</font>
#### 单列排序
```sql
SELECT last_name, job_id, department_id, hire_date
FROM employees
ORDER BY hire_date ;   # 默认升序排列
ORDER BY hire_date DESC; # 降序
```
#### 多列排序
```sql
SELECT last_name, department_id, salary
FROM employees
ORDER BY department_id, salary DESC;
```
- 在对多列进行排序的时候，首先排序的第一列必须有相同的列值，才会对第二列进行排序。如果第一列数据中所有的值都是唯一的，将不再对第二列进行排序
### 分页
#### 背景
背景1：查询返回的记录太多了，查看起来很不方便，怎么样能够实现分页查询呢？
背景2：表里有 4 条数据，我们只想要显示第 2、3 条数据怎么办呢？
#### 实现规则
- 分页原理
  所谓分页显示，就是将数据库中的结果集，一段一段显示出来需要的条件。
- MySQL中使用 LIMIT 实现分页
  格式：
```sql
LIMIT [位置偏移量,] 行数
```
第一个“位置偏移量”参数指示MySQL从哪一行开始显示，是一个可选参数，如果不指定“位置偏移量”，将会从表中的第一条记录开始（第一条记录的位置偏移量是0，第二条记录1）；第二个参数“行数”指示返回记录条数。

>MySQL 8.0中可以使用“LIMIT 3 OFFSET 4”，意思是获取从第5条记录开始后面的3条记录，和“LIMIT 4,3;”返回的结果相同。

```sql
# MySQL8  从第4行 获得五条记录
SELECT * FROM employees LIMIT 3,5
SELECT * FROM employees LIMIT 5 OFFSET 3
```
- ==分页显式公式：（当前页数-1）\*每页条数，每页条数==
```sql
SELECT * FROM table
LIMIT(PageNo - 1)*PageSize,PageSize;
```
==注意：LIMIT 子句必须放在整个SELECT语句的最后！==
```sql 
select * from employees limit 0,8    # 第1页
select * from employees limit 8,8    # 第2页
select * from employees limit 16,8  # 第3页
select * from employees limit 24,8  # 第4页
select * from employees limit 32,8  # 第5页
```

使用limit的好处
约束返回结果的数量可以==减少数据表的网络传输量,提升查询效率。如果我们知道返回结果只有1条直接limit 1，select不需要扫描整张表，只需要检索到一条数据即可返回==

# 第六章 多表查询
### 案例
前提条件：这些一起查询的表之间是有关系的（一对一、一对多），它们之间一定是有关联字段，这个关联字段可能建立了外键，也可能没有建立外键。
```sql
# 查询员工姓名部门
select last_name,department_name from employees,departments;
```
查询出了2996条数据,很多重复
![[Pasted image 20241110205248.png | 400]]
```sql
# 错误情况 笛卡尔积错误
select count(employee_id) from employees;
select count(department_id) from departments;
select 107*28 from dual;
=2996
```

#### 笛卡尔积
笛卡尔乘积是一个数学运算。假设我有两个集合 X 和 Y，那么 X 和 Y 的笛卡尔积就是==X 和 Y 的所有可能组合==，也就是第一个对象来自于 X，第二个对象来自于 Y 的所有可能。组合的个数即为两个集合中元素个数的乘积数。
![[Pasted image 20241110205407.png | 400]]

SQL92中，笛卡尔积也称为 交叉连接 ，英文是 CROSS JOIN 。在 SQL99 中也是使用 CROSS JOIN表示交叉连接。它的作用就是可以把任意表进行连接，即使这两张表不相关。在MySQL中==如下情况会出现笛卡尔积：==
```sql
#查询员工姓名和所在部门名称
SELECT last_name,department_name FROM employees,departments;
SELECT last_name,department_name FROM employees CROSS JOIN departments;
SELECT last_name,department_name FROM employees INNER JOIN departments;
SELECT last_name,department_name FROM employees JOIN departments;
```

错误会在下面条件产生
- 省略多个表的连接
- 连接条件无效
- 所有表中的所有行都互相连接
==为了避免笛卡尔积，可以使用where加入有效的连接==
```sql
SELECT table1.column, table2.column
FROM table1, table2
WHERE table1.column1 = table2.column2;
```
正确写法
```sql
#案例：查询员工的姓名及其部门名称
SELECT last_name, department_name
FROM employees, departments
WHERE employees.department_id = departments.department_id;
```
### 多表查询分类
#### 分类1：等值连接 vs 非等值连接
等值连接
![[Pasted image 20241110224533.png | 300]]
连接 n个表,至少需要n-1个连接条件。比如，连接三个表，至少需要两个连接条件。

非等值连接
![[Pasted image 20241110231948.png | 300]]
```sql
SELECT e.`last_name`,e.salary,j.`grade_level` FROM employees e,job_grades j 
WHERE e.`salary` BETWEEN j.`lowest_sal` AND j.`highest_sal`
```
#### 分类2：自连接 vs 非自连接
![[Pasted image 20241110232404.png | 500]]
- 当table1和table2本质上是同一张表，只是用取别名的方式虚拟成两张表以代表不同的意义。然后两个表再进行内连接，外连接等查询。
查询employees表，返回“Xxx works for Xxx”
```sql
SELECT CONCAT(worker.last_name ,' works for ', manager.last_name)
FROM employees worker, employees manager 
WHERE worker.manager_id = manager.employee_id ;
```
==COUCAT 拼接字符串 COUNT 计算数量 LENGTH 计算字符串长度==

#### 分类3：内连接 vs 外连接
除了查询满足条件的记录以外，外连接还可以查询某一方不满足条件的记录。
![[Pasted image 20241111231353.png | 300]]

- ==内连接: 满足条件的数据查出来，其他的没有查出来 (交集)==
- ==外连接: 满足条件的数据查出来，还查询到了左表或右表不匹配的行==
- 如果是左外连接，则连接条件中左边的表也称为 主表 ，右边的表称为 从表 。
- 如果是右外连接，则连接条件中右边的表也称为 主表 ，左边的表称为 从表 。
- 还有一个满外连接，左中右全部输出
==SQL92：使用(+)创建连接==
- 在 SQL92 中采用（+）代表从表所在的位置。即左或右外连接中，(+) 表示哪个是从表。
- Oracle 对 SQL92 支持较好，而 MySQL 则不支持 SQL92 的外连接。
```sql
#92内连接
SELECT employees.last_name,departments.department_name
FROM employees,departments 
WHERE employees.department_id = departments.department_id
#左外连接
SELECT last_name,department_name
FROM employees ,departments
WHERE employees.department_id = departments.department_id(+);
#右外连接
SELECT last_name,department_name
FROM employees ,departments
WHERE employees.department_id(+) = departments.department_id;
```
- 而且在 SQL92 中，只有左外连接和右外连接，没有满（或全）外连接。
### SQL99语法实现多表查询
#### 1.基本语法
- ==使用join on子句创建连接的语法结构==
```sql
SELECT table1.column, table2.column,table3.column
FROM table1
JOIN table2 ON table1 和 table2 的连接条件
JOIN table3 ON table2 和 table3 的连接条件
```
例：查询员工姓名地址部门信息
```sql
SELECT e.`last_name`, d.`department_id`,l.`city` 
FROM employees e join departments d 
on e.`department_id` = d.`department_id` 
join locations l  on d.`location_id` = l.`location_id`
```
- ==关键字 JOIN、INNER JOIN、CROSS JOIN 的含义是一样的，都表示内连接==
#### 2.内连接 （INNER JOIN）的实现
内连接inner join与join一样
```sql
SELECT 字段列表
FROM A表 INNER JOIN B表
ON 关联条件
WHERE 等其他子句
```
#### 3.外连接(OUT JOIN)的实现
##### 左外连接(LEFT OUTER JOIN)
```sql
# 查询A表满足条件与不满足条件的行
SELECT 字段列表
FROM A表 LEFT JOIN B表
ON 关联条件
WHERE 等其他子句
```
##### 右外连接(RIGHT OUTER JOIN)
```sql
# 查询B表满足条件与不满足条件的行
SELECT 字段列表
FROM A表 RIGHT JOIN B表
ON 关联条件
WHERE 等其他子句
```
##### 满外连接(FULL OUTER JOIN)
MySQL99不支持FULL 
```sql
# 可以使用 UNION
SELECT last_name,department_name
FROM employees e LEFT JOIN departments d
ON e.`department_id` = d.`department_id`
UNION 
SELECT last_name,department_name
FROM employees e RIGHT JOIN  departments d
ON e.`department_id` = d.`department_id`
```
#### 4.UNION
**UNION 操作符用于合并两个或多个 SELECT 语句的结果集**，利用union关键字。可以给出多条SELECT语句,并将他们的结果合成单个结果集。
合并时,两个表对应的列数和数据类型必须相同,并且相互对应。各个SELECT语句之间使用union或者union all关键字分隔

语法：
```sql
SELECT column,... FROM table1
UNION [ALL]
SELECT column,... FROM table2
```
UNION操作符
- 返回查询结果的并集，去除重复记录
UNION ALL
- 返回查询结果的并集，不去除重复记录

尽量使用UNION ALL，效率高

#### 5. 7种SQL JOINS的实现
![[Pasted image 20241123103552.png | 400]]
左中图
```sql 
# 查询e与d表中匹配的行与e表中不匹配的行数据，然后筛选出d表id为null的数据。
# 因为e与d对应的数据id一定对应存在，所以查询到的数据是e表中不匹配的数据
# 为什么筛选条件是d的null呢？
# 因为需要筛选出的是e表数据（纯e表数据），需要排除掉匹配的行，两个表id相等就是匹配。所以筛选条件是d表的null
# 总的来说就是筛选出e表数据，条件是与筛选出与d表不相关的数据
SELECT employee_id,last_name,department_name
FROM employees e LEFT JOIN departments d
ON e.`department_id` = d.`department_id`
WHERE d.`department_id` IS NULL # 筛选出e与d不相关的数据
```
右中图
```sql
# 查询e表与d表中匹配的行与d表中不匹配的行数据，然后筛选出e表id为null的数据。
# 因为e与d对应数据id一定对应存在，所以查询到的数据是d表中不匹配的数据
# 为什么筛选条件是e的null呢？
# 因为需要筛选出是d表的数据（纯d表数据），需要排除掉匹配的行，两个表id相等就是匹配。所以筛选条件是e表的null
# 总的来说就是筛选出d表数据，条件是与筛选出与e表不相关的数据
SELECT employee_id,last_name,department_name
FROM employees e RIGHT JOIN departments d
ON e.`department_id` = d.`department_id`
WHERE e.`department_id` IS NULL # 筛选d与e不相关的数据
```
左外连接或右外连接，想要拿到与另一张表不相关的数据，可以用上述方法。
左主表与右表中，外连接查询完毕，WHERE过滤右表为null的数据，即可取得坐表与右表不相关的数据

左下图 满外连接   结合左右外连接的数据
```sql
SELECT employee_id,last_name,department_name
FROM employees e LEFT JOIN departments d
ON e.`department_id` = d.`department_id`
UNION ALL
SELECT employee_id,last_name,department_name
FROM employees e RIGHT JOIN departments d
ON e.`department_id` = d.`department_id`
```

右下图 结合左右外连接的互相不匹配数据  
```sql
SELECT employee_id,last_name,department_name
FROM employees e LEFT JOIN departments d
ON e.`department_id` = d.`department_id`
WHERE d.`department_id`IS NULL
UNION ALL
SELECT employee_id,last_name,department_name
FROM employees e RIGHT JOIN departments d
ON e.`department_id` = d.`department_id`
WHERE e.`department_id`IS NULL
```

### SQL99语法新特性
#### 1.自然连接
SQL99 在 SQL92 的基础上提供了一些特殊语法，比如 **NATURAL JOIN** 用来表示自然连接。我们可以把自然连接理解为 SQL92 中的等值连接。**它会帮你自动查询两张连接表中 所有相同的字段 ，然后进行 等值连接** 。
SQL92标准
```sql
SELECT employee_id,last_name,department_name
FROM employees e JOIN departments d
ON e.`department_id` = d.`department_id`
AND e.`manager_id` = d.`manager_id`;
```
SQL99标准
```sql
SELECT employee_id,last_name,department_name
FROM employees e NATURAL JOIN departments d;
```
#### 2.USING连接
当我们进行连接的时候，SQL99还支持使用 **USING** **指定数据表里的 同名字段 进行等值连接**。但是只能配合JOIN一起使用。比如：
```sql
SELECT employee_id,last_name,department_name
FROM employees e JOIN departments d
USING (department_id);
```

#### 小节
表连接约束方式有三种：WHERE ON USING
- WHERE：适用于所有关联查询
- ON：只能和join一起使用，是能写关联条件，虽然关联条件可以使用WHERE，分开可读性更好
- USING：只能和JOIN一起使用，而且要求两个关联字段在关联表中名称一致，而且只能表示关联字段值相等
