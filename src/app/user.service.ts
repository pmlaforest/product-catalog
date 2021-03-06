import { Injectable } from '@angular/core';
import { User } from './User';
import { Router, RouterModule } from '@angular/router';
import {ProduitService} from './produit.service';
import { Produit } from './Produit';
import { IQteProduit } from './Catalogue';
import {Panier} from './Panier';

@Injectable()
export class UserService {

users: User[] = [{
      firstName: 'Alexandre',
      lastName: 'Girard-Gagnon',
      username: 'evilermine',
      password: 'password',
      email: 'alexandre.girardgagnon1@gmail.com',
      address: '5150 Rue des Ormes',
      city: 'Jonquiere',
      country: 'Canada',
      panier: new Panier()
    }];
currentUser: User;
connected: boolean = false;

constructor(private router: Router, private produitService: ProduitService) { }

  getUsername(): string{
    return this.currentUser.username;
  }
  getPassword(): string{
    return this.currentUser.password;
  }

  connect(username:string, password:string){
    for(this.currentUser of this.users){
      if(username == this.currentUser.username && password == this.currentUser.password){
        this.connected = true;
        //la ligne qui suit fait en sorte que le total tombe a 0.00 au lieu de -0.00
        this.currentUser.panier.total = 0.003;                          
        alert("sign in successful");
        this.router.navigateByUrl('catalogue');
        return;
      }
    }

    alert("wrong username of password");
  }

  disconnect(){
    this.connected = false;
    this.currentUser = null;
  }

  newUser(user: User){
    this.users.push(user);
  }

  addProduct(element: IQteProduit) : void{

    if (this.connected == false) {
      this.router.navigateByUrl('sign-in');
      return;
    }

    console.log("produit ajoute au panier");
    
    let index: number = 0;
    
    for(let produit of this.currentUser.panier.produits){
      if(element.produit.id == produit.produit.id){
        this.currentUser.panier.produits[index].quantite += element.quantite;
        this.currentUser.panier.total += element.produit.price;
        return;
      }
      index++;
    }
    this.currentUser.panier.produits.push(element);
    this.currentUser.panier.total += element.produit.price;
  }

  removeProduct(element: IQteProduit){
    console.log("removed");
    let index: number = 0;
      
    for(let produit of this.currentUser.panier.produits){
      if(element.produit.id == produit.produit.id){    
        if(produit.quantite == 1)
        {
          this.currentUser.panier.produits.splice(index, 1);
        }
        else 
        {
          this.currentUser.panier.produits[index].quantite -= element.quantite;
        }
        this.currentUser.panier.total -= element.produit.price;
        return;
      }
      index++;
    }
  }

  getCurrentUserPanier(){
    return this.currentUser.panier.produits;
  }

  getCurrentUserTotal(){
    return this.currentUser.panier.total;
  }

  clearProduits(){
    while (this.currentUser.panier.produits.length > 0){
      this.currentUser.panier.produits.pop();
    }
  }

  clearTotal(){
    this.currentUser.panier.total = 0;
  }
}
