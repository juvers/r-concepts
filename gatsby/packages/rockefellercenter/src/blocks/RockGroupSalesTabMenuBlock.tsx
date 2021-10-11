/**@jsx jsx */
import {jsx} from '@tishman/components';
import {useLocation} from '@reach/router';
import RockGroupSalesGeneralBlock from '~blocks/RockGroupSalesGeneralBlock';
import RockGroupSalesTravelProfessionalsBlock from '~blocks/RockGroupSalesTravelProfessionalsBlock';
import RockGroupSalesStudentGroupsBlock from '~blocks/RockGroupSalesStudentGroupsBlock';
import RockGroupSalesCorporateGroupsBlock from './RockGroupSalesCorporateGroupsBlock';

const RockGroupSalesTabMenuBlock = (): JSX.Element | null => {
  switch (useLocation().hash) {
    case '#travel-professionals':
      return <RockGroupSalesTravelProfessionalsBlock />;
    case '#student-groups':
      return <RockGroupSalesStudentGroupsBlock />;
    case '#corporate-groups':
      return <RockGroupSalesCorporateGroupsBlock />;
    default:
      return <RockGroupSalesGeneralBlock />;
  }
};

export default RockGroupSalesTabMenuBlock;
