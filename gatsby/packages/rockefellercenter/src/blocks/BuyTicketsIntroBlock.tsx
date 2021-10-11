/** @jsx jsx */
import {jsx, Container} from '@tishman/components';
import {useMemo, useState, useEffect, Fragment} from 'react';
import invariant from 'invariant';
import {BuyTicketsBar, Hero} from '~components/BuyTickets';
import userStore from '~buy-tickets/store/user/userStore';
import allPostsStore from '~buy-tickets/store/odt-posts/allPostsStore';

import type {BuyTicketsData} from '~components/BuyTickets';

const BuyTicketsIntroBlock = ({
  data,
  isRunning,
  showPrice,
}: {
  data: BuyTicketsData;
  isRunning: boolean;
  showPrice?: boolean;
}): JSX.Element => {
  const [userState, setUserState] = useState(userStore.initialState);
  const [allPostsState, setAllPostsState] = useState(
    allPostsStore.initialState,
  );

  useEffect(() => {
    const userSub = userStore.subscribe(setUserState);
    const postsSub = allPostsStore.subscribe(setAllPostsState);
    userSub.add(postsSub);
    return () => userSub.unsubscribe();
  }, []);

  const page = data.page;
  invariant(page, 'Expected valid buy tickets page json');

  const heroData = useMemo(() => {
    if (!page?.hero?.title) throw new Error('Expected buy tickets page title');
    return {
      title: page.hero.title,
      link: page.hero.link,
    };
  }, [page]);

  return (
    <Fragment>
      <Container sx={{maxWidth: 990, mt: 3}}>
        <Hero
          title={heroData.title}
          isRunning={isRunning}
          link={heroData.link}
          showPrice={showPrice}
        />
      </Container>
      <BuyTicketsBar
        showPrice={showPrice}
        title={heroData.title}
        price={userState.totalPrice}
        tax={allPostsState.sale?.SaleTotalTax}
        isRunning={isRunning}
      />
    </Fragment>
  );
};

export default BuyTicketsIntroBlock;
