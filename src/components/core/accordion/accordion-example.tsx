'use client';

import React from 'react';
import { Accordion } from './accordion';

export function AccordionExample() {
  return (
    <div className="mx-auto max-w-md p-6">
      <h2 className="mb-4 text-lg font-medium">Accordion Örneği</h2>

      <Accordion.Root
        defaultValue={['item-1']}
        className="rounded-sm border border-gunmetal/30"
      >
        <Accordion.Item value="item-1">
          <Accordion.Trigger>Accordion Item 1</Accordion.Trigger>
          <Accordion.Content>
            <p className="text-ash">
              Bu bir örnek açıklama metnidir. Accordion içeriğini burada
              gösteriyoruz. İçerik uzun veya kısa olabilir.
            </p>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="item-2">
          <Accordion.Trigger>Accordion Item 2</Accordion.Trigger>
          <Accordion.Content>
            <p className="text-ash">
              İkinci accordion öğesinin içeriği burada yer alır. Bu içerik
              farklı bir bilgi barındırabilir.
            </p>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="item-3">
          <Accordion.Trigger>Accordion Item 3</Accordion.Trigger>
          <Accordion.Content>
            <p className="text-ash">
              Üçüncü accordion öğesinin içeriği. İsterseniz burada resim, liste
              veya başka bileşenler de kullanabilirsiniz.
            </p>
            <div className="mt-2 rounded-sm bg-tulpar-blue/10 p-2">
              <p className="text-xs">Örnek bir vurgulanmış alan</p>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}
