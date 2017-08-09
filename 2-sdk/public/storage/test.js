function saveSessionStorage() {
    sessionStorage.setItem("keys", "values");
}

function showSessionStorage() {
    alert(sessionStorage.getItem("keys"));
    alert(sessionStorage.keys);
}

function savelocalStorage() {
    localStorage.setItem("keyl", "valuel");
}

function showlocalStorage() {
    alert(localStorage.getItem("keyl"));
    alert(localStorage.keyl);
}

var dataBase;
this.createDatabase = function() {
    dataBase = openDatabase("teacher", "1.0", "教师表", 1024 * 1024, function() {});
    if (!dataBase) {
        alert("数据库创建失败！");
    } else {
        alert("数据库创建成功！");
    }
}


this.createTable = function() {
    dataBase.transaction(function(context) {
        context.executeSql(
            "create table if not exists teacher (id REAL UNIQUE, name TEXT)", [],
            function(context, result) {
                alert('创建teacher表成功');
            },
            function(context, error) {
                alert('创建teacher表失败:' + error.message);
            });
    });
}



this.insertData = function() {
    dataBase.transaction(function(context) {
        context.executeSql(
            "insert into teacher (id, name) values(?, ?)", ["1", 'aa老师'],
            function() {
                console.log('添加数据成功');
            },
            function(context, error) {
                console.log('添加数据失败: ' + error.message);
            });
    });
    dataBase.transaction(function(context) {
        context.executeSql(
            "insert into teacher (id, name) values(?, ?)", ["2", 'bb老师'],
            function() {
                console.log('添加数据成功');
            },
            function(context, error) {
                console.log('添加数据失败: ' + error.message);
            });
    });
    dataBase.transaction(function(context) {
        context.executeSql(
            "insert into teacher (id, name) values(?, ?)", ["3", 'cc老师'],
            function() {
                console.log('添加数据成功');
            },
            function(context, error) {
                console.log('添加数据失败: ' + error.message);
            });
    });
}



this.queryData = function() {
    dataBase.transaction(function(context) {
        context.executeSql(
            "select * from teacher", [],
            function(context, result) {
                console.log(result);
                console.log(context);

            },
            function(context, error) {
                alert('查询失败: ' + error.message);
            });
    });
}


this.dropTable = function() {
    dataBase.transaction(function(tx) {
        tx.executeSql('drop table teacher');
    });
}












