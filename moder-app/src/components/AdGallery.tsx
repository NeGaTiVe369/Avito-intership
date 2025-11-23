import type { Advertisement } from '../types/ad'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './AdGallery.css'

interface AdGalleryProps {
  images: Advertisement['images']
  title: string
}

const AdGallery = ({ images, title }: AdGalleryProps) => {
  if (!images || images.length === 0) {
    return (
      <section className="detail-section">
        <div className="detail-section-title">Галерея</div>
        <div className="gallery-empty">Изображения отсутствуют</div>
      </section>
    )
  }

  const hasMultiple = images.length > 1

  return (
    <section className="detail-section">
      <Swiper
        className="gallery-swiper"
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        spaceBetween={16}
        loop={hasMultiple}
        navigation={hasMultiple}
        pagination={hasMultiple ? { clickable: true } : false}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="gallery-slide">
              <img
                src={src || '/placeholder.svg'}
                alt={`${title} — фото ${index + 1}`}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default AdGallery
