//Shared swiper configs
export const productSwiperConfigurations = {
  scrollbar: { draggable: true },
  navigation: true,
  spaceBetween: 15,
  centeredSlides: false,
  breakpoints: {
    //Galaxy fold
    0: {
      slidesPerView: 1.8,
    },
    //Mobile screen
    320: {
      slidesPerView: 1.8,
    },
    //IPad
    767: {
      slidesPerView: 1.6,
    },
    //IPad Pro
    1024: {
      slidesPerView: 1.6,
    },
    //Laptops small screens
    1025: {
      slidesPerView: 2.6,
    },
    //Bigger screens
    1400: {
      slidesPerView: 2.6,
    },
  },
};

export const planTabsSwiperConfigs = {
  scrollbar: { draggable: true },
  spaceBetween: 32,
  slidesPerView: 'auto' as 'auto',
};

export const subscriptionsSwiper = {
  scrollbar: { draggable: true },
  navigation: true,
  spaceBetween: 24,
  centeredSlides: false,
  pagination: { clickable: true },
  breakpoints: {
    //Galaxy fold
    0: {
      slidesPerView: 1,
      pagination: { clickable: true },
    },
    //Mobile screen
    320: {
      slidesPerView: 1,
      pagination: { clickable: true },
    },
    //IPad
    767: {
      slidesPerView: 2,
      pagination: false,
    },
    //IPad Pro
    1024: {
      slidesPerView: 2,
      pagination: false,
    },
    //Laptops and bigger screens
    1200: {
      pagination: false,
      slidesPerView: 3,
    },
  },
};
