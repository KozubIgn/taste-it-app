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
  faBlender
} from '@fortawesome/free-solid-svg-icons';
import {
  faSquarePlus,
  faStar as farStar,
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
      faBowlRice,
      faBlender
    );
  }
}
