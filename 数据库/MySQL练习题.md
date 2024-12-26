# 第一章 SQL
[第一章练习题](D:\User\桌面\MySQL\练习\章节练习)
# 第二章 MySQL安装卸载等
#### 安装好MySQL之后在windows系统中哪些位置能看到MySQL?
- MySQL DBMS软件的安装位置。 D:\develop_tools\MySQL\MySQL Server 8.0
- MySQL 数据库文件的存放位置。 C:\ProgramData\MySQL\MySQL Server 8.0\Data
- MySQL DBMS 的配置文件。 C:\ProgramData\MySQL\MySQL Server 8.0\my.ini
- MySQL的服务（要想通过客户端能够访问MySQL的服务器，必须保证服务是开启状态的）MySQL的path环境变量
#### 卸载MySQL主要卸载哪几个位置的内容？
- 使用控制面板的软件卸载，去卸载MySQL DBMS软件的安装位置。D:\develop_tools\MySQL\MySQL Server 8.0
- 手动删除数据库文件。 C:\ProgramData\MySQL\MySQL Server 8.0\Data
- MySQL的环境变量
- MySQL的服务进入注册表删除。（ regedit ）务必重启电脑
#### MySQL5.7在配置完以后，如何修改配置文件？
为什么要修改my.ini文件？ 默认的数据库使用的字符集是latin1。我们需要修改为：utf8
修改哪些信息？
```sql
[mysql] #大概在63行左右，在其下添加
...
default-character-set=utf8 #默认字符集
[mysqld] # 大概在76行左右，在其下添加
...
character-set-server=utf8
collation-server=utf8_general_ci
```
修改完以后，需要重启服务。

# 第三章 SELECT的基本使用
```sql
# 1.查询员工12个月的工资总和，并起别名为ANNUAL SALARY
SELECT employee_id , last_name,salary * 12 "ANNUAL SALARY" FROM employees;

# 如果算上佣金的话，应该这样计算，并且要避免佣金出现空值，如果佣金为空那么就置为1，保持原样IFNULL判断是否为空，为空则置为0
SELECT employee_id,last_name,salary * 12 * (1 + IFNULL(commission_pct,0)) "ANNUAL SALARY" 
FROM employees;

# 2.查询employees表中去除重复的job_id以后的数据
select DISTINCT job_id from  employees;

# 3.查询工资大于12000的员工姓名和工资
select * from employees where salary > 12000
select * from employees where salary between 12000 and 12000
select * from employees where salary >

# 4.查询员工号为176的员工的姓名和部门号
select last_name,job_id from employees where employee_id = 176

# 5.显示表 departments 的结构，并查询其中的全部数据
desc departments
select * from departments
```
# 第四章 运算符
```sql
# 1.选择工资不在5000到12000的员工的姓名和工资
SELECT first_name,salary FROM employees WHERE salary < 5000 or salary > 12000
select first_name,salary from employees where not salary between 5000 and 12000 

# 2.选择在20或50号部门工作的员工姓名和部门号
select first_name,department_id from employees where department_id = 20 or department_id =  50
SELECT first_name,department_id FROM employees WHERE department_id in (20,50)

# 3.选择公司中没有管理者的员工姓名及job_id
select first_name,job_id from  employees where ISNULL(manager_id) 
select first_name,job_id from  employees where manager_id IS NULL  
SELECT first_name,job_id FROM  employees WHERE manager_id <=> NULL  

# 4.选择公司中有奖金的员工姓名，工资和奖金级别
select first_name,salary,commission_pct from employees where not commission_pct <=> null
select first_name,salary,commission_pct from employees where not isnull(commission_pct) 
select first_name,salary,commission_pct from employees where commission_pct is not null 

# 5.选择员工姓名的第三个字母是a的员工姓名
select first_name from employees where first_name like '__a%'
select * from employees;

# 6.选择姓名中有字母a和k的员工姓名
select first_name from employees where first_name like '%a%'  and first_name like '%k%' 
select first_name from employees where first_name like '%a%k%'  or first_name like '%k%a%' 


# 7.显示出表 employees 表中 first_name 以 'e'结尾的员工信息
select first_name from employees where first_name regexp 'e$'   
SELECT first_name FROM employees WHERE first_name like '%e'   


# 8.显示出表 employees 部门编号在 80-100 之间的姓名、工种
select first_name,job_id,department_id from employees where (department_id >= 80 and department_id <= 100)
SELECT first_name,job_id,department_id FROM employees WHERE  department_id between 80 AND 100

# 9.显示出表 employees 的 manager_id 是 100,101,110 的员工姓名、工资、管理者id
select first_name,salary,manager_id from employees where manager_id in(100,101,110)
```
# 第五章 分页与排序
```sql
#1. 查询员工的姓名和部门号和年薪，按年薪降序,按姓名升序显示
SELECT first_name,salary*12 salary_year, manager_id FROM employees ORDER BY salary_year DESC,first_name ASC
#2. 选择工资不在 8000 到 17000 的员工的姓名和工资，按工资降序，显示第21到40位置的数据
SELECT first_name,salary FROM employees WHERE salary NOT BETWEEN 8000 AND 17000 ORDER BY salary DESC LIMIT 20,20
#3. 查询邮箱中包含 e 的员工信息，并先按邮箱的字节数降序，再按部门号升序
SELECT email FROM employees WHERE email REGEXP '[e]' # like '%e%' 
ORDER BY LENGTH(email) DESC,manager_id ASC
```
# 第六章 多表查询
```sql
# 1.显示所有员工的姓名，部门号和部门名称。
select e.first_name, e.department_id ,d.department_name
from employees e left join departments d
on e.department_id = d.`department_id`

# 2.查询90号部门员工的job_id和90号部门的location_id
select first_name, e.job_id, d.location_id ,e.`department_id`
from employees e join departments d
on e.`department_id`=d.`department_id`
where e.`department_id`= 90

# 3.选择所有有奖金的员工的 last_name , department_name , location_id , city
select last_name , department_name , d.location_id ,l.city
from employees e left join departments d
using(department_id)
left join locations l
using(location_id) 
where e.`commission_pct` is not null 

# 4.选择city在Toronto工作的员工的 last_name , job_id , department_id , department_name
select e.last_name , e.job_id , e.department_id , d.department_name
from employees e  join departments d
using(department_id)
right join locations l
using(location_id)
where city = 'Toronto'

# 5.查询员工所在的部门名称、部门地址、姓名、工作、工资，其中员工所在部门的部门名称为’Executive’
select d.`department_name`  ,l.street_address,e.`first_name`,e.`job_id`,e.`salary`
from employees e left join departments d
using(department_id)
left join locations l   # Kimberely的employee_id是NULL，所以如果使用JOIN就会导致这个数据丢失，所以要使用LEFT JOIN
using(location_id)   # 如果使用JOIN就代表与前面的结果是内连接，会导致数据丢失
where department_name="Executive"

# 6.选择指定员工的姓名，员工号，以及他的管理者的姓名和员工号，结果类似于下面的格式
# employees  Emp#    manager  Mgr#
# kochhar      101        king         100
select emp.last_name "employees", emp.employee_id "Emp#",mgr.last_name"manager",mgr.employee_id "Mgr#"
from employees emp left join employees mgr  # e1的所有数据与e2匹配的数据
on emp.manager_id  = mgr.employee_id

# 7.查询哪些部门没有员工
select first_name,department_name
from employees right join departments
using(department_id)
where employee_id is null

#方式1：
SELECT d.department_id
FROM departments d LEFT JOIN employees e
ON e.department_id = d.`department_id`
WHERE e.department_id IS NULL
#方式2：
SELECT department_id
FROM departments d
WHERE NOT EXISTS ( # 查看每一条数据，不满足条件则输出
SELECT *
FROM employees e
WHERE e.`department_id` = d.`department_id`
)

# 8. 查询哪个城市没有部门
SELECT department_name,city
FROM departments
right join locations
using(location_id)
WHERE department_id IS NULL

SELECT l.location_id,l.city
FROM locations l LEFT JOIN departments d
ON l.`location_id` = d.`location_id`
WHERE d.`location_id` IS NULL

# 9. 查询部门名为 Sales 或 IT 的员工信息
select emp.first_name,dep.department_name
from employees emp right join departments dep
using(department_id)
where department_name = "Sales" or department_name="IT"

SELECT employee_id,last_name,department_name
FROM employees e,departments d
WHERE e.department_id = d.`department_id`
AND d.`department_name` IN ('Sales','IT');
```
```sql
【题目】
#1.所有有门派的人员信息
select `name`,age,empno 
from t_emp e join t_dept d
on d.id = e.deptid

select *
from t_emp a inner join t_dept b
on a.deptId = b.id;

（ A、B两表共有）
#2.列出所有用户，并显示其机构信息
select `name`,age,empno,deptName,address
from t_emp	e left join t_dept d
on e.deptid = d.id

select *
from t_emp a left join t_dept b
on a.deptId = b.id;

（A的全集）
#3.列出所有门派
select * from t_dept

（B的全集）
#4.所有不入门派的人员
select * from t_emp  e left join t_dept d
on e.deptid = d.id
where d.id is null

select *
from t_emp a left join t_dept b
on a.deptId = b.id
where b.id is null;

 （A的独有）
#5.所有没人入的门派
select * from t_emp  e right join t_dept d
on e.deptid = d.id
where e.deptid is null

select *
from t_dept b left join t_emp a
on a.deptId = b.id
where a.deptId is null;

（B的独有）
#6.列出所有人员和机构的对照关系
select * from 
t_emp e left join t_dept d
on e.deptid = d.id
union
select * from 
t_emp e right join t_dept d
on e.deptid = d.id

SELECT *
FROM t_emp A LEFT JOIN t_dept B
ON A.deptId = B.id
UNION
SELECT *
FROM t_emp A RIGHT JOIN t_dept B
ON A.deptId = B.id

(AB全有)
#MySQL Full Join的实现 因为MySQL不支持FULL JOIN,下面是替代方法
#left join + union(可去除重复数据)+ right join
#7.列出所有没入派的人员和没人入的门派
select * from 
t_emp e left join t_dept d
on e.deptid = d.id
where d.id is null
union
select * from 
t_emp e right join t_dept d
on e.deptid = d.id
where e.deptid is null

SELECT *
FROM t_emp A LEFT JOIN t_dept B
ON A.deptId = B.id
WHERE B.`id` IS NULL
UNION
SELECT *
FROM t_emp A RIGHT JOIN t_dept B
ON A.deptId = B.id
WHERE A.`deptId` IS NULL;
（A的独有+B的独有）
```

# 第七章 单行函数

```sql
# 1.显示系统时间(注：日期+时间)
SELECT NOW() FROM DUAL
# 2.查询员工号，姓名，工资，以及工资提高百分之20%后的结果（new salary）
SELECT employee_id,first_name,salary,salary*1.2 'new salary' FROM employees;

# 3.将员工的姓名按首字母排序，并写出姓名的长度（length）
select first_name, length(first_name) from employees order by first_name;

# 4.查询员工id,last_name,salary，并作为1列输出，别名为OUT_PUT
select concat(employee_id,',',last_name,',',salary)out_put from employees

# 5.查询公司各员工工作的年数、工作的天数，并按工作年数的降序排序
SELECT  first_name,truncate(DATEDIFF(sysdate(),hire_date) / 365 ,0)'work_year' ,DATEDIFF(sysdate(),hire_date) 'work_day' 
FROM employees order by work_year desc

# 6.查询员工姓名，hire_date , department_id，满足以下条件：雇用时间在1997年之后，department_id 为80 或 90 或110, commission_pct不为空

select first_name,hire_date,department_id from employees 
#WHERE hire_date >= '1997-01-01'
#WHERE hire_date >= STR_TO_DATE('1997-01-01', '%Y-%m-%d')
where date_format(hire_date,'%y') >= '1997'

select first_name,hire_date,department_id from employees 
where year(hire_date) >= 1997 and department_id in(80,90,110) and commission_pct is not null

# 7.查询公司中入职超过10000天的员工姓名、入职时间
select first_name,hire_date from employees
where datediff(sysdate(),hire_date) > 10000

# 8.做一个查询，产生下面的结果 
#<last_name> earns <salary> monthly but wants <salary*3>
-- Dream Salary
-- King earns 24000 monthly but wants 72000
select concat(last_name,' earns ',truncate(salary,0) ,' monthly but wants ',truncate(salary*3,0)) "Dream Salary"
from employees

select * from employees
# 使用CASE-WHEN，按照下面的条件：
-- job grade
-- AD_PRES A
-- ST_MAN B
-- IT_PROG C
-- SA_REP D
-- ST_CLERK E
-- 产生下面的结果
-- Last_name Job_id Grade
-- king AD_PRES A
select last_name Last_name,job_id Job_id,case job_id when 'AD_PRES' then 'A'  
												when 'ST_MAN' then 'B'
												WHEN 'IT_PROG' THEN 'C'
												WHEN 'SA_REP' THEN 'D'
												WHEN 'ST_CLERK' THEN 'E'
												else 'F'  # 其他对应F
												end "grade" #名称
from employees
```

# 第八章 聚合函数