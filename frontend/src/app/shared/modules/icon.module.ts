import { NgModule } from '@angular/core';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
  faHeart,
  faArrowLeft,
  faArrowRight,
  faArrowRightToBracket,
  faHouse,
  faStar,
  faUtensils,
  faStar as fasStar,
  faCirclePlus,
  faBasketShopping,
  faListCheck,
  faBars,
  faXmark,
  faTags,
  faGift,
  faDoorOpen,
  faImage,
  faFileArrowDown,
  faClock,
  faBowlFood,
  faCarrot,
  faPenToSquare,
  faTrashCan,
  faFireBurner,
  faBowlRice,
  faBlender,
  faCartPlus,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import {
  faHeart as farHeart,
  faSquarePlus,
  faStar as farStar,
  faCircleXmark,
  faHand
} from '@fortawesome/free-regular-svg-icons';

@NgModule({
  imports: [FontAwesomeModule],
  exports: [FontAwesomeModule],
})
export class IconModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      fasStar,
      farStar,
      faStar,
      faHouse,
      faHeart,
      farHeart,
      faSquarePlus,
      faUtensils,
      faArrowLeft,
      faArrowRight,
      faArrowRightToBracket,
      faCirclePlus,
      faBasketShopping,
      faListCheck,
      faBars,
      faXmark,
      faTags,
      faGift,
      faDoorOpen,
      faImage,
      faFileArrowDown,
      faClock,
      faBowlFood,
      faCarrot,
      faPenToSquare,
      faTrashCan,
      faFireBurner,
      faCircleXmark,
      faBowlRice,
      faBlender,
      faCartPlus,
      faHand,
      faPlus
    );
  }
}
