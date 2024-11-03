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
  - <font color="yellow">SELECT是SQL语言的基础，最为重要</font>
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
1. DISTINCT 其实是对后面所有列名的组合进行去重，你能看到最后的结果是 74 条，因为这 74 个部门id不同，都有 salary 这个属性值。如果你想要看都有哪些不同的部门（department_id），只需要写 DISTINCT department_id 即可，后面不需要再加其他的列名了。
   
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
语法格式为：LEAST(值1，值2，...，值n)。其中，“值n”表示参数列表中有n个值。在有
两个或多个参数的情况下，返回最小值。
```sql
SELECT LEAST (1,0,2), LEAST('b','a','c'), LEAST(1,NULL,2);
```
![[Pasted image 20241103193243.png|400]]
- 当参数是整数或者浮点数时，LEAST将返回其中最小的值；
- 当参数为字符串时，返回字母表中顺序最靠前的字符；
- 当比较值列表中有NULL时，不能判断大小，返回值为NULL。
#### 最大值运算符 
语法格式为：GREATEST(值1，值2，...，值n)。其中，n表示参数列表中有n个值。当有
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




### 3.逻辑运算符

### 4.位运算符

### 5.运算符的优先级
