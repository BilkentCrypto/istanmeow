import React, { useRef, useState, useEffect } from 'react';
import blockies from 'blockies-identicon';
import Image from 'next/image';

export default function Avatar({
  address,
  image,
  w = 100,
  h = 100,
  sizes,
  imageStyle = 'rounded-full',
}) {
  const canvas = useRef(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    if ((err || !image) && canvas.current) {
      blockies.render(
        {
          seed: address,
          scale: 3,
          bgcolor: '#6DB3F2',
          spotcolor: '#fff',
        },
        canvas.current,
      );
    }
  }, [err, address, image]);

  return (
    <div
      className="rounded-md overflow-hidden"
      style={{ position: 'relative', width: '100%', height: '100%' }}>
      {!err && image ? (
        <Image
          alt={`Image of ${address}`}
          className={imageStyle}
          src={image}
          fill
          sizes={'(max-width: 768px) 80px'}
          priority="high"
          onError={e => {
            setErr(!err);
          }}
        />
      ) : (
        <div className=" ">
          <canvas className="w-full rounded-full" ref={canvas} />
        </div>
      )}
    </div>
  );
}
