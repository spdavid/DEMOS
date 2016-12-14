import { IHockyPlayer } from './HockeyPlayersWebPart';

import {
  IPropertyPaneDropdownOption // for the PropertyPaneDropdownOptions
} from '@microsoft/sp-client-preview';

export default class MockHttpClient {

  private static _players: IHockyPlayer[] = [
    { Title: "David Opdendries Center", Position: "Center", ImageUrl: "https://pbs.twimg.com/profile_images/644110122285985792/kzJiElTY.jpg" },
    { Title: "David Opdendries Center", Position: "Center", ImageUrl: "https://pbs.twimg.com/profile_images/644110122285985792/kzJiElTY.jpg" },
    { Title: "David Opdendries Center", Position: "Center", ImageUrl: "https://pbs.twimg.com/profile_images/644110122285985792/kzJiElTY.jpg" },
    { Title: "David Opdendries Left", Position: "Left Wing", ImageUrl: "https://pbs.twimg.com/profile_images/644110122285985792/kzJiElTY.jpg" },
    { Title: "David Opdendries Left", Position: "Left Wing", ImageUrl: "https://pbs.twimg.com/profile_images/644110122285985792/kzJiElTY.jpg" }
  ];

  public static GetPositions() : Promise<IPropertyPaneDropdownOption[]>
  {
      let mockPositions : IPropertyPaneDropdownOption[] =  [
         { key: "Center", text: "Center" },
         { key: "Left Wing", text: "Left Wing" }
       ]

      return Promise.resolve(mockPositions);
  }

  public static getPlayers(position : string): Promise<IHockyPlayer[]> {
    return new Promise<IHockyPlayer[]>((resolve) => {
      let filteredPlayers = MockHttpClient._players.filter(item => item.Position === position);
      resolve(filteredPlayers);
    });
  }
}
