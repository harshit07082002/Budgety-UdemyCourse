//Calculate Budget
var BudgetCalculator=(function(){

    var Income=function(id , desc , cost){
        this.id=id;
        this.desc=desc;
        this.cost=cost;
    }
    var Expenses=function(id , desc , cost){
        this.id=id;
        this.desc=desc;
        this.cost=cost;
    }
    var obj={
        items:{
            inc:[],
            exp:[]
        },
        value:{
            inc:0,
            exp:0
        },
        budget:0
    }
    return{

        setter:function(type,DESC,COST1){
            var ID,set;
            console.log(type);
            if(obj.items[type].length>0)
            {
                ID=obj.items[type][(obj.items[type].length-1)].id+1;
            }
            else{
                ID=0;
            }
            if(type==='inc')
            {
                set=new Income(ID,DESC,COST1);
            }
            else{
                set=new Expenses(ID,DESC,COST1);
            }
            obj.items[type].push(set);
            var a=obj.value[type];
          
            var b=parseFloat(a)+parseFloat(COST1);
            obj.value[type]=b;
            var string=JSON.stringify(obj);
            window.localStorage.setItem("temp",string);
            // console.log(obj);
           return set;
        },
        getNo:function(){
            obj.budget=obj.value.inc-obj.value.exp;
            var string=JSON.stringify(obj);
            window.localStorage.setItem("temp",string);
            return {
                    budget:obj.budget,
                    inc:obj.value.inc,
                    exp:obj.value.exp
            };
        },
        deleteElement:function(id1,type){
            var ar;
            ar=obj.items[type].map(function(current){
                return current.id
            });
            index=ar.indexOf(parseInt(id1));
            if(index!=-1)
            {
                obj.value[type]-=parseFloat(obj.items[type][index].cost);
                obj.items[type].splice(index,1);
            }
            var string=JSON.stringify(obj);
            window.localStorage.setItem("temp",string);
            // console.log(JSON.parse(window.localStorage.getItem("temp")));
            // console.log(obj);
        },
        setOBJ:function(o){
            obj=o;
        },
        getOBJ:function(o){
            return obj;
        },
    };

})();

//Change UI
var ChangeUI=(function(){
    var domMan={
        tick:'.abc',
        selector:'#plus',
        Desc:'#item',
        number:"#Value",
        income:'.inc',
        expenses:'.exp',
        heading:'.second1 h1',
        plus:'.second1 h2',
        fullInc :"#fullInc",
        fullExp :'#fullExp',
        container:'.container',
        date:'.date',
        green:'#green',
        red:'#red'
    };
    var changeNumber=function(no){
        var ar,int,dot;
        no=Math.abs(no);
        no=no.toFixed(2);
        ar=no.split('.');
        int=ar[0];
        dot=ar[1];
        if(int.length>3)
        int = int.substring(0,int.length-3)+','+int.substring(int.length-3,int.length);
        return int+'.'+dot;
    };
   return{
       getClass:function(){
        return domMan;
       },
       getInput:function(){
        var obj={
            ver: document.querySelector(domMan.selector).value,
            desc:document.querySelector(domMan.Desc).value,
            cost:document.querySelector(domMan.number).value
        };
       
        return obj;
       },

       setUI:function(type,desc,cost,id){
        var html;
        if(type==='inc'){
            html=`<div class="lastItem" id="inc-${id}"><div class="item"><p class="desc">${desc}</p><div class="x"><div class="one"><p class="number">+</p><p class="number">${changeNumber(cost)}<p></div><button class="exit"><i class="ion-ios-close-outline"></i></button></div></div><hr></div>`;
            document.querySelector(domMan.income).insertAdjacentHTML('beforeend',html);
        }
        else{
            html=`<div class="lastItem" id="exp-${id}"><div class="item"><p class="desc">${desc}</p><div class="x"><div class="one"><p class="number">-</p><p class="number">${changeNumber(cost)}<p></div><button class="exit"><i class="ion-ios-close-outline"></i></button></div></div><hr></div>`;
            document.querySelector(domMan.expenses).insertAdjacentHTML('beforeend',html);
        }

       },
       clearFields:function(){
        var clear,clearAr;
        clear=document.querySelectorAll(domMan.Desc+','+domMan.number);
        clearAr=Array.prototype.slice.call(clear);
        clearAr.forEach(element => {
            element.value='';
        });
        clearAr[0].focus();
       },
       setNumbers:function(inc , exp , budget){
            if(budget<0)
            {
                document.querySelector(domMan.plus).textContent='-';
                document.querySelector(domMan.heading).innerHTML=changeNumber(Math.abs(budget));
            }
            else{
                document.querySelector(domMan.plus).textContent='+';
                document.querySelector(domMan.heading).innerHTML=changeNumber(Math.abs(budget));
            }
            
            document.querySelector(domMan.fullInc).textContent=changeNumber(inc);
            document.querySelector(domMan.fullExp).textContent=changeNumber(exp);
       },
       deleteElement:function(id2){
        document.querySelector("#"+id2).remove();
       },

       setDate:function(){
           var d,year,month,months;
           d=new Date();
           year=d.getFullYear();
           month=d.getMonth();
           months=['January','February','March','April','May','June','July','August','September','October','November','December'];
           document.querySelector(domMan.date).textContent = months[month]+" "+year;
       }
   };
})();

//linker
var LinkBoth=(function(UI,BC){
    var DOM=UI.getClass();
    //Event Handlers
    function clickListners(){
        document.querySelector(DOM.tick).addEventListener('click',doTask);
           
        document.addEventListener('keypress',function(e){
            if(e.keyCode===13)
            {   console.log('clicked');
                doTask();
            }
        });
        document.querySelector(DOM.container).addEventListener('click',deleteItem);
        document.querySelector(DOM.selector).addEventListener('change',function(){
           console.log('inside')
            document.querySelector(DOM.Desc).classList.toggle("red-focus");
            document.querySelector(DOM.number).classList.toggle("red-focus");
            document.querySelector(DOM.selector).classList.toggle("red-focus");
            document.querySelector(DOM.tick).classList.toggle("red");
        });
      window.addEventListener('load',()=>{
          // Update UI

          var obj=JSON.parse(window.localStorage.getItem("temp"));
          if(obj){
          console.log(obj);
          BC.setOBJ(obj);
          var inc=obj.items.inc;
          var exp=obj.items.exp;
        //   console.log(exp);
        for(var i=0;i<inc.length;i++)
        {
            UI.setUI("inc",inc[i].desc,inc[i].cost,inc[i].id);
        }
         
        for(var i=0;i<exp.length;i++)
        {
            UI.setUI("exp",exp[i].desc,exp[i].cost,exp[i].id);
        }
        UI.setNumbers(obj.value.inc,obj.value.exp,obj.budget);
        }
      });
    }
    //Main Task
    function updateBudget(){
   
        //Get Numbers

        var no=BC.getNo(); 
        
     //Display numbers on screen

        UI.setNumbers(no.inc,no.exp,no.budget);
        
    }
    function doTask(){
        //Get the input from ChangeUI
        
        var item=UI.getInput();
        
        //Check if all fields are filled or not
        
        if(item.desc===''||item.cost===''|| parseFloat(item.cost)<=0)
         return;
      
        //Send It to Budget Calculator
        var final=BC.setter(item.ver,item.desc,item.cost);
        
        // Display it on the screen
        
        UI.setUI(item.ver,final.desc,final.cost,final.id);
        
        // Clear existing desc and val
        
        UI.clearFields();
        
        //Update and Calculate Budget
        
        updateBudget()

    }
    var deleteItem=function(e){
        var element,id,type,d;
        element=e.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(element);
        if(element){
        d=element.split('-');
        type=d[0];
        id=d[1];
        // d=e.target.parentNode.parentNode.parentNode.parentNode.id;
        //Delete the item in data structure
        
        BC.deleteElement(id,type);

        //Delete the item in UI

        UI.deleteElement(element);

        //Change the UI

        updateBudget();
        }
    }
    return{
        init : function(){
            UI.setDate();
            clickListners();
            console.log('Application Start');
        }
    };
})(ChangeUI,BudgetCalculator);

LinkBoth.init();
