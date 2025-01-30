
type Instantiable<T> = new (...args: any[]) => T;
abstract class AbstractPayrollManager {
	constructor(protected order:Order) {
	}
	abstract hello(): void
}

class PayrollManager extends AbstractPayrollManager{
	hello() {
		console.log(`hello ${this.order.name}`)
	}
}

class Gonoszgeci{}


class PayrollManager2 extends AbstractPayrollManager{
	hello() {
		console.log(`szia ${this.order.name}`)
	}
}

class Order{
	name: string = "Józsi"

	static payrollManagerClass:  Instantiable<AbstractPayrollManager>;

	private payrollManager: AbstractPayrollManager
	constructor() {
		this.payrollManager = new Order.payrollManagerClass(this)
	}

	hello() { this.payrollManager.hello() }
}


Order.payrollManagerClass = PayrollManager2;

let order = new Order();
order.hello()




//
//
// class MyClass {
// 	name: string = "Józsi"
// }
//
// class Ext1 {
// 	declare name: string;
// 	hello() {
// 		console.log(`hello ${this.name}`)
// 	}
// }
//
// class Ext2 {
// 	world() {
// 		console.log("world")
// 	}
// }
//
//
//
//
//
//
//
//
//
// function extend<T extends new (...args: any[]) => any>(Base: T, ...mixins: any[]) {
// 	class Mixed extends Base {}
// 	for(let mixin of mixins) {
// 		for(let key of Object.getOwnPropertyNames(mixin.prototype)) {
// 			Mixed.prototype[key] = mixin.prototype[key];
// 		}
// 	}
// 	return Mixed;
// }
// // for(let key of Object.getOwnPropertyNames(Ext1.prototype)) {
// // 	MyClass.prototype[key] = Ext1.prototype[key];
// // }
//
// let NewClass = extend(MyClass, Ext1, Ext2);
//
// let o = new NewClass();
//
// o.hello()
// o.world()