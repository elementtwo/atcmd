var fs = require('fs');
var code = fs.readFileSync('hubs', 'utf8');
var esprima = require('esprima');
var eswalk = require('eswalk');

function get1(ast) {
  arr=[];
  eswalk(ast, function(n, p) { //node, parent
    if ((n.type === 'AssignmentExpression')&&(n.left)&&(n.left.object)&&(n.left.object.object)&&(n.left.object.object.name)&&(n.left.object.object.name === 'proxies')&&(n.left.object.property)&&(n.left.object.property.value)&&(n.left.property)&&(n.left.property.name)&&(n.left.property.name === 'server')&&(n.right)&&(n.right.properties)) {
      hub={};
      hub.name=n.left.object.property.value;
      hub.functions=[];
      n.right.properties.forEach(function (property) {
        f={};
        f.name=property.key.name;
        f.params=property.value.params.map(function (property) {
          return property.name;
        });
        hub.functions.push(f);
      });
      arr.push(hub);
    }
  });
  return arr;
}

ast=esprima.parse(code);
arr=get1(ast);
function replacer(key, value) {
  str=JSON.stringify(value);
  if (str.length<=60) {
    console.log(str);
    return str;
  } else {
    console.log(value);
    return value;
  }
}
console.log(JSON.stringify(arr));
arr.forEach(function(hub) {
  console.log('*'+hub.name);
  hub.functions.forEach(function (f) {
    console.log('**'+f.name+'('+f.params.join(', ')+')');
  });
});
obj={};
arr.forEach(function(hub) {
  obj[hub.name]={};
  hub.functions.forEach(function (f) {
    obj[hub.name][f.name]=[f.params];
  });
});
console.log(JSON.stringify(obj));
