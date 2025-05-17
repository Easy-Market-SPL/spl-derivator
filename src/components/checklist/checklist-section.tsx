import { Slide } from 'react-awesome-reveal';
import Checklist from '@/components/checklist/checklist';

function ChecklistSection() {
  return (
    <section className="flex-1 bg-gray-50 py-24 px-6">
        <div className="max-w-screen-lg mx-auto">
          <Slide direction="left" triggerOnce>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Personaliza tu <b className='text-blue-600'>Marketplace</b></h2>
          </Slide>
          <Checklist />
        </div>
    </section>
  );
}

export default ChecklistSection;