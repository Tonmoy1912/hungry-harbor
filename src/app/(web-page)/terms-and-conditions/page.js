import { StopProgress } from '@/components/util/util'
import React from 'react'

export default function page() {
  const website="Hungry-Harbor"
  return (
    <div className='py-14 px-10 w-full bg-black text-white flex flex-col gap-4 justify-start items-start'>
      <StopProgress/>
      <h1 className='pb-6 text-4xl font-extrabold text-center w-full'>Terms & Conditions</h1>

      <p>
      Welcome, if you continue to browse and use this website you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern100xDevs relationship with you in relation to this website.      </p>
      <p>
      The term ‘{website}’ or ‘us’ or ‘we’ refers to the owner of the website. The term ‘you’ refers to the user or viewer of our website.
      </p>
      
      <div>
        <p className='pb-2'>
        The use of this website is subject to the following terms of use:
        </p>
        <ol type='1' className='flex flex-col gap-2'>

          <li>
          1. The content of the pages of this website is for your general information and use only. It is subject to change without notice.
          </li>

          <li>
          2 .Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose.
          </li>

          <li>
          3. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
          </li>

          <li>
          4. Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable.
          </li>

          <li>
          5. It shall be your own responsibility to ensure that any products, services or information available through this website meet your specific requirements.
          </li>

          <li>
          6. This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics.
          </li>

          <li>
          7. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
          </li>

          <li>
          8. All trademarks reproduced in this website which is not the property of, or licensed to, the operator is acknowledged on the website.
          </li>

          <li>
          9. Unauthorized use of this website by you may give rise to a claim for damages and/or be a criminal offense. From time to time this website may also include links to other websites.
          </li>

          <li>
          10. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s). We take no responsibility for the content of the linked website(s).
          </li>

          <li>
          11. Other Terms: Credit Card orders or other online order will commence on receiving the authorization/confirmation from the Credit Card/respective Payment Gateway companies.
          </li>

        </ol>

      </div>

    </div>
  )
}
