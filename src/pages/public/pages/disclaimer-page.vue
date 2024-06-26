<template>
  <div class="entries-page full-width column q-pt-xl">
    <div
      class="col-12"
      :class="{ 'q-px-md': isMobile, 'q-px-xl': !isMobile }"
    >
      <h2 class="text-positive text-weight-bold text-h4 q-my-none q-pb-md">
        {{ title }}
      </h2>
      <div
        class="column justify-start items-start text-caption text-disable q-pl-sm"
      >
        <template v-if="subTitles">
          <span
            v-for="(sub, subIndex) in subTitles"
            :key="subIndex + '__content-box-sub-title'"
            >{{ sub }}</span
          >
        </template>
      </div>
    </div>
    <div
      class="row justify-between items-stretch"
      :class="{ 'column reverse': isMobile, 'q-px-xl': !isMobile }"
    >
      <div class="left-side col-12 col-md-8 q-px-xs">
        <content-box :items="teamContents"></content-box>
      </div>
      <div
        class="right-side col-12 col-md-4"
        :class="{ 'q-px-md': isMobile, 'q-px-xs': !isMobile }"
      >
        <table-of-content :items="teamContents"></table-of-content>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { PublicItem } from 'src/core/types/public-item-types'
import ContentBox from 'src/pages/public/components/content-box.vue'
import TableOfContent from 'src/pages/public/components/table-of-content.vue'
import { computed } from 'vue'

const $q = useQuasar()

// data
const title = 'Website Disclaimer'
const subTitles = [
  'Effective Date: January 8th, 2019',
  'Site Covered: atlas-os.org',
]
//computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})

const teamContents: PublicItem[] = [
  {
    label:
      'This Disclaimer ("Disclaimer") Is Applicable To The Website Listed Above',
    to: 'this-disclaimer-is-applicable-to-the-website-listed-above.',
    content: `EFFECTIVE DATE: Effective Date above means the date this Disclaimer becomes effective.
  <br/>
  OPERATOR: The use of this website and services on this website are provided by Shannon Genomics Inc (hereinafter referred to as "Company" or "Operator") and are subject to this Disclaimer.
  <br/>
  YOU: Throughout this Disclaimer, "you" and second-person pronouns such as "your" and "yours" will refer to you, as a user of the website.
  <br/>
  Should you continue to use the website, the Company deems that as a manifestation of your assent to this Disclaimer.
  <br/>
  PARTIES: The parties to this Disclaimer are the Company and you, as the user of this website. Hereinafter, the parties will individually be referred to as "Party" and collectively as "Parties."
  <br/>
  Please note that you must be at least 18 (eighteen) years of age to use this website. By using this website, you represent and warrant that you are at least 18 years of age and have the ability to legally understand and agree to this Disclaimer. The Company assumes no responsibility or liability for any misrepresentation of your age. If you are not 18 years of age, you must stop using the website now.
  <br/>
  By continuing to use this website, you assent to each term and section contained in this Disclaimer.
  <br/>
  You hereby understand and acknowledge that the Company is not acting as an attorney, certified financial planner, broker, or other regulated advisor through your use of the website.
  <br/>
  If you are in need of legal advice or financial advice, please consult the appropriate advisor, such as your own attorney, accountant, or other professional.
  <br/>
  You agree that your use of the website is at your sole and exclusive risk and that any services provided by the Company are on an "As Is" basis. The Company hereby expressly disclaims any and all express or implied warranties of any kind, including, but not limited to the implied warranty of fitness for a particular purpose and the implied warranty of merchantability. The Company makes no warranties that the website will meet your needs or that the website will be uninterrupted, error-free, or secure. The Company also makes no warranties as to the reliability or accuracy, completeness, or quality of any information on the website or obtained through any services. You agree that the Company is not liable for any errors, omissions, loss or damage which may be caused by your use of the website, to the fullest extent permitted by law. Any damage that may occur to you, through your computer or mobile system, or as a result of loss of your data from your use of the website is your sole responsibility.
  <br/>
  The maximum liability of the Company arising from or relating to your use of the website is limited to the greater of one hundred ($100) US dollars or the amount you paid to the Company in the last three (3) months. This applies to any and all claims by you, including, but not limited to, lost profits or revenues, consequential or punitive damages, negligence, strict liability, fraud, or torts of any kind.
  <br/>
  Documents, information, or other services received on or through this website may not be appropriate for your particular situation, the assessment of which is your sole and exclusive responsibility.
  <br/>
  The Company makes no assurances to any particular outcome based on your use of the website, including business or financial outcomes.
  <br/>
  You agree that the website provided by the Company is the property of the Company, including all copyrights, trademarks, trade secrets, patents, and other intellectual property ("Company IP"). You agree that the Company owns all right, title and interest in and to the Company IP and that You will not use the Company IP for any unlawful or infringing purpose. You agree not to reproduce or distribute the Company IP in any way, including electronically or via registration of any new trademarks, trade names, service marks or Uniform Resource Locators (URLs), without express written permission from the Company.
  <br/>
  You agree not to use the website for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the website in any way that could damage the website or general business of the Company.`,
  },
  {
    label: 'You Further Agree Not To Use The Website',
    to: 'you-further-agree-not-to-use-the-website',
    content: `
  1) To harass, abuse, or threaten others or otherwise violate any person's legal rights;
  <br/>
  2) To violate any intellectual property rights of the Company or any third party;
  <br/>
  3) To upload or otherwise disseminate any computer viruses or other software that may damage the property of another;
  <br/>
  4) To perpetrate any fraud; s
  <br/>
  5) To engage in or create any unlawful gambling, sweepstakes, or pyramid scheme;
  <br/>
  6) To publish or distribute any obscene or defamatory material;
  <br/>
  7) To publish or distribute any material that incites violence, hate, or discrimination towards any group;
  <br/>
  8) To unlawfully gather information about others.
`,
  },
  {
    label: 'Indemnification',
    to: 'indemnification',
    content: `You agree to defend and indemnify the Company and any of its affiliates (if applicable) and hold us harmless against any and all legal claims and demands, including reasonable attorney's fees, which may arise from or relate to your use or misuse of the website, your breach of this Disclaimer or any of our other legal documents, or your conduct or actions. You agree that the Company shall be able to select its own legal counsel and may participate in its own defense, if the Company wishes.
  <br/>
  Through your use of the website, you agree that the laws of New Jersey shall govern any matter or dispute relating to or arising out of this Disclaimer, as well as any dispute of any kind that may arise between you and the Company, with the exception of its conflict of law provisions.`,
  },
  {
    label: 'Arbitration',
    to: 'arbitration',
    content: `In case of a dispute between the Parties relating to or arising out of this Agreement, the Parties shall first attempt to resolve the dispute personally and in good faith. If these personal resolution attempts fail, the Parties shall then submit the dispute to binding arbitration. The arbitration shall be conducted in the county chosen by the Company. The arbitration shall be conducted by a single arbitrator, and such arbitrator shall have no authority to add Parties, vary the provisions of this Agreement, award punitive damages, or certify a class. The arbitrator shall be bound by applicable and governing Federal law as well as the law of the following state: New Jersey. Each Party shall pay their own costs and fees. Claims necessitating arbitration under this section include, but are not limited to: contract claims, tort claims, claims based on Federal and state law, and claims based on local laws, ordinances, statutes or regulations. Intellectual property claims by the Company will not be subject to arbitration and may, as an exception to this sub-part, be litigated. The Parties, in agreement with this sub-part of this Agreement, waive any rights they may have to a jury trial in regard to arbitral claims.`,
  },
]
</script>
