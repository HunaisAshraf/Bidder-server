export interface IPaymentRepository {
  add(id: string, amount: number, message: any): Promise<any>;
  get(id: string): Promise<any>;
  edit(id:string,amount:any,details:any):Promise<any>
}
