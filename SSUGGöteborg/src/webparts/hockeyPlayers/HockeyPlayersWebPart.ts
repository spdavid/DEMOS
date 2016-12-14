import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-client-preview';

import styles from './HockeyPlayers.module.scss';
import * as strings from 'hockeyPlayersStrings';
import { IHockeyPlayersWebPartProps } from './IHockeyPlayersWebPartProps';

import MockHttpClient from './HockeyPlayers.Mock';
// add this to access your environment type
import { EnvironmentType } from '@microsoft/sp-client-base';

export interface IHockyPlayer {
  Title: string;
  Position: string;
  ImageUrl: string;
}

export default class HockeyPlayersWebPart extends BaseClientSideWebPart<IHockeyPlayersWebPartProps> {

private _Positions : IPropertyPaneDropdownOption[];

  public constructor(context: IWebPartContext) {
    super(context);
  }

 public onInit(): Promise<void> {
   return this._GetPositions().then((positions) => {
        this._Positions = positions;
      });



}

  public render(): void {
   this._GetHockeyPlayers().then((players) => {
      let html = "";
      for (var i = 0; i < players.length; i++) {
        let player = players[i];
        html += `<div class='${styles.playerContainer}'>
                        <img src='${player.ImageUrl}' />
                        <div>${player.Title}</div>
                      </div>`;
      }

      this.domElement.innerHTML = `
      <div class="${styles.hockeyPlayers}">
        <div class="${styles.container}">
        <h1>Showing Players from position:${this.properties.HockeyPosition} </h1>
         ${html}
         <br style='clear:both' />
        </div>
      </div>`;
    });


  }


 private _GetPositions(): Promise<IPropertyPaneDropdownOption[]> {
if (this.context.environment.type === EnvironmentType.Local)
{
  return MockHttpClient.GetPositions();
}
else
{
    // the new _spPageContextInfo
    let weburl = this.context.pageContext.web.absoluteUrl;
    // rest query to get all choices from the Positions Field
    let restQuery = `${weburl}/_api/web/lists/getbytitle('Hockey%20Players')/Fields(guid'4e6c2a57-7883-4fb2-98d4-bc65d60cc98d')`;

    let positions: IPropertyPaneDropdownOption[] = [];

    // this.context.httpClient.get = $.getJson(...)
    return this.context.httpClient.get(restQuery)
      .then((data: Response) => {
        return data.json();
      })
      .then((json) => {

        for (var i = 0; i < json.Choices.length; i++) {
          let Position = json.Choices[i];
          positions.push({ key: Position, text: Position });
        }

        return positions;
      });
}
  }

  private _GetHockeyPlayers(): Promise<IHockyPlayer[]> {

if (this.context.environment.type === EnvironmentType.Local)
{
  return MockHttpClient.getPlayers(this.properties.HockeyPosition)
}
else
{

  let players: IHockyPlayer[] = [];

  // the new _spPageContextInfo
      let weburl = this.context.pageContext.web.absoluteUrl;
      let restQuery = `${weburl}/_api/web/lists/getbytitle('Hockey Players')/items?$filter=Position%20eq%20%27${this.properties.HockeyPosition}%27`;

      return this.context.httpClient.get(restQuery)
        .then((data: Response) => {
          return data.json();
        })
        .then((json) => {

          for (var i = 0; i < json.value.length; i++) {
            let player = json.value[i];
            players.push({ Title: player.Title, Position: player.Position, ImageUrl: player.Picture.Url });
          }
          return players;
        });
}
  }



  protected get propertyPaneSettings(): IPropertyPaneSettings {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneDropdown('HockeyPosition',{
                  label: "Choose position",
                  options: this._Positions
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
