import { Component, OnInit , OnDestroy} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIReposnse, Game } from 'src/app/model';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit,OnDestroy {
  public sort!:string;
  public games:Array<Game> | undefined;
  private routeSub!:Subscription;
  private gameSub!:Subscription;

  constructor(
    private httpService:HttpService,
    private router:Router,
    private activatedRoute:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.routeSub=this.activatedRoute.params.subscribe((params:Params)=>{
      if (params['game-search']){
        this.searchGames('metacrit',params['game-search']);
      }
      else{
        this.searchGames('metacrit');
      }
    })
  }

  searchGames(sort:string,search?:string):void{
    this.gameSub=this.httpService
    .geGameList(sort,search)
    .subscribe((gameList:APIReposnse<Game>)=>{
      this.games=gameList.results;
      console.log("this is game",this.games[0].id)
      console.log(gameList)
    });
  }

  openGameDetails(id:number){
    // console.log("this is id: ",id)
    this.router.navigate(['details',id]);
  }
  ngOnDestroy():void{
    if(this.gameSub){
      this.gameSub.unsubscribe();
    }
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
  }
}
