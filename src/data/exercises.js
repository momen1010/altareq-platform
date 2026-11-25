// Interactive exercises per lesson (by lesson position in the course). Plain data, no imports.
// Types: mcq { options, answer }, tf { answer }, fill { accept[] }, order { words | answers[][] }, match { pairs[[left, right]] }.

export const exercises = {
  'nahw-foundations': {
    0: [
      { type: 'mcq', prompt: 'كلمة «قلم» في الجملة تُعد…', options: ['اسمًا', 'فعلًا', 'حرفًا'], answer: 0, explanation: 'تقبل «ال» والتنوين وحروف الجر: القلمُ، قلمٌ، بالقلمِ، وهذه علامات الاسم.' },
      { type: 'mcq', prompt: 'كلمة «كتبَ» تُعد…', options: ['اسمًا', 'فعلًا', 'حرفًا'], answer: 1, explanation: 'تقبل تاء التأنيث الساكنة (كتبتْ) وتدل على حدث مقترن بزمان.' },
      { type: 'match', prompt: 'صل كل كلمة بنوعها.', pairs: [['قلم', 'اسم'], ['يكتبُ', 'فعل'], ['في', 'حرف'], ['مدرسة', 'اسم']], explanation: 'الاسم يقبل «ال»، والفعل يقبل «قد» أو السين، والحرف لا يقبل شيئًا من ذلك.' },
      { type: 'tf', prompt: 'الحرف يدل على معنى في نفسه.', answer: false, explanation: 'الحرف يدل على معنى في غيره، مثل «في» و«على».' },
    ],
    1: [
      { type: 'mcq', prompt: 'الجملة «العلمُ نورٌ» جملة…', options: ['اسمية', 'فعلية'], answer: 0, explanation: 'تبدأ باسم هو «العلمُ».' },
      { type: 'mcq', prompt: 'الجملة «كتبَ الطالبُ الدرسَ» جملة…', options: ['اسمية', 'فعلية'], answer: 1, explanation: 'تبدأ بفعل هو «كتبَ».' },
      { type: 'fill', prompt: 'الجملة التي تبدأ باسم تسمى جملة ____', accept: ['اسمية'], explanation: 'الجملة الاسمية تبدأ باسم، والفعلية تبدأ بفعل.' },
      { type: 'order', prompt: 'رتّب الكلمات لتكوّن جملة فعلية.', answers: [['كتبَ', 'الطالبُ', 'الدرسَ'], ['كتبَ', 'الدرسَ', 'الطالبُ']], explanation: 'الجملة الفعلية تبدأ بالفعل، ثم الفاعل، ثم المفعول به.' },
    ],
    2: [
      { type: 'mcq', prompt: 'علامة النصب الأصلية في الاسم المفرد هي…', options: ['الضمة', 'الفتحة', 'الكسرة', 'السكون'], answer: 1, explanation: 'الرفع بالضمة، والنصب بالفتحة، والجر بالكسرة.' },
      { type: 'fill', prompt: 'علامة الرفع الأصلية هي ____', accept: ['الضمة', 'ضمة'], explanation: 'الضمة علامة الرفع الأصلية، مثل «العلمُ».' },
      { type: 'tf', prompt: 'الفاعل مرفوع دائمًا.', answer: true, explanation: 'نقول: كتبَ الطالبُ، فالفاعل مرفوع.' },
    ],
    3: [
      { type: 'mcq', prompt: 'في جملة «الطقسُ جميلٌ» المبتدأ هو…', options: ['الطقسُ', 'جميلٌ'], answer: 0, explanation: 'المبتدأ هو الاسم الذي نبدأ به، والخبر يتمم المعنى.' },
      { type: 'fill', prompt: 'المبتدأ يكون ____ دائمًا.', accept: ['مرفوعا', 'مرفوع'], explanation: 'المبتدأ والخبر مرفوعان في الجملة الاسمية البسيطة.' },
    ],
    4: [
      { type: 'fill', prompt: 'كان ترفع المبتدأ وتنصب ____', accept: ['الخبر', 'خبرها'], explanation: 'تسمى المبتدأ اسمها، والخبر خبرها: كان الجوُّ جميلًا.' },
      { type: 'mcq', prompt: 'في «كان الجوُّ جميلًا» خبر كان هو…', options: ['الجوُّ', 'جميلًا'], answer: 1, explanation: '«جميلًا» منصوب بالفتحة لأنه خبر كان.' },
      { type: 'match', prompt: 'صل كل أداة بعملها.', pairs: [['كان', 'ترفع المبتدأ وتنصب الخبر'], ['إنّ', 'تنصب المبتدأ وترفع الخبر']], explanation: 'عمل كان في الخبر، وعمل إنّ في المبتدأ.' },
    ],
    5: [
      { type: 'mcq', prompt: 'في «إنَّ العلمَ نورٌ» اسم إنّ هو…', options: ['العلمَ', 'نورٌ'], answer: 0, explanation: 'اسم إنّ منصوب، وخبرها مرفوع.' },
      { type: 'tf', prompt: 'خبر إنّ منصوب.', answer: false, explanation: 'خبر إنّ مرفوع، واسمها هو المنصوب.' },
      { type: 'fill', prompt: 'اسم إنّ يكون ____', accept: ['منصوبا', 'منصوب'], explanation: 'تنصب إنّ المبتدأ فيصير اسمها.' },
    ],
    6: [
      { type: 'mcq', prompt: 'في «نجحَ الطالبُ» الفاعل هو…', options: ['نجحَ', 'الطالبُ'], answer: 1, explanation: 'الفاعل هو من قام بالفعل، وهو مرفوع.' },
      { type: 'tf', prompt: 'الفاعل منصوب دائمًا.', answer: false, explanation: 'الفاعل مرفوع دائمًا.' },
      { type: 'fill', prompt: 'الفاعل يكون ____ دائمًا.', accept: ['مرفوعا', 'مرفوع'], explanation: 'اسأل: من فعل؟ فجوابك الفاعل المرفوع.' },
    ],
    7: [
      { type: 'mcq', prompt: 'في «قرأ الولدُ الكتابَ» المفعول به هو…', options: ['الولدُ', 'الكتابَ'], answer: 1, explanation: 'المفعول به هو من وقع عليه الفعل، وهو منصوب.' },
      { type: 'tf', prompt: 'المفعول به منصوب.', answer: true, explanation: 'نقول: قرأ الولدُ الكتابَ، فالكتابَ منصوب بالفتحة.' },
      { type: 'fill', prompt: 'المفعول به هو من وقع عليه ____', accept: ['الفعل', 'فعل'], explanation: 'الفاعل يفعل، والمفعول به يقع عليه الفعل.' },
    ],
  },
  'sarf-made-simple': {
    0: [
      { type: 'mcq', prompt: 'علم الصرف يبحث في…', options: ['بنية الكلمة وتغيراتها', 'أواخر الكلمات وإعرابها', 'معاني الجمل'], answer: 0, explanation: 'الصرف يدرس صيغ الكلمات وبنيتها، أما الإعراب فمن علم النحو.' },
      { type: 'tf', prompt: 'الجذر الثلاثي يتكون من ثلاثة أحرف أصلية.', answer: true, explanation: 'مثل: ك ت ب.' },
    ],
    1: [
      { type: 'mcq', prompt: 'الجذر الثلاثي لكلمة «مدرسة» هو…', options: ['مدر', 'درس', 'رسة'], answer: 1, explanation: 'الميم والتاء المربوطة زائدتان، والأصل: د ر س.' },
      { type: 'fill', prompt: 'جذر كلمة «كاتب» هو ك ت ____', accept: ['ب'], explanation: 'الجذر: ك ت ب.' },
      { type: 'match', prompt: 'صل كل كلمة بجذرها.', pairs: [['مكتبة', 'كتب'], ['عالم', 'علم'], ['مدرّس', 'درس']], explanation: 'احذف الحروف الزائدة تصل إلى الجذر.' },
    ],
    2: [
      { type: 'mcq', prompt: 'الحرف الزائد في كلمة «استخرج» مع «است» هو…', options: ['الألف والسين والتاء', 'الراء والجيم', 'الخاء فقط'], answer: 0, explanation: 'الجذر خ ر ج، وزيدت الألف والسين والتاء.' },
      { type: 'tf', prompt: 'الزيادة على الجذر قد تغيّر المعنى.', answer: true, explanation: 'مثل: كتب، كاتب، مكتوب.' },
    ],
    3: [
      { type: 'mcq', prompt: '«كاتب» على وزن…', options: ['فعيل', 'فاعل', 'مفعول'], answer: 1, explanation: 'فاعل: اسم الفاعل من الثلاثي.' },
      { type: 'mcq', prompt: '«كبير» على وزن…', options: ['فاعل', 'فعيل', 'أفعل'], answer: 1, explanation: 'ك-ب-ر على وزن ف-ع-ل مع الياء: فعيل.' },
      { type: 'match', prompt: 'صل الكلمة بوزنها.', pairs: [['عالم', 'فاعل'], ['كريم', 'فعيل'], ['أكبر', 'أفعل']], explanation: 'قابل الحروف بـ ف ع ل.' },
    ],
    4: [
      { type: 'mcq', prompt: 'اسم الفاعل من «كتبَ» هو…', options: ['كاتب', 'مكتوب', 'كتابة'], answer: 0, explanation: 'كاتب على وزن فاعل.' },
      { type: 'fill', prompt: 'اسم المفعول من «فتحَ» هو ____', accept: ['مفتوح'], explanation: 'على وزن مفعول.' },
    ],
    5: [
      { type: 'tf', prompt: 'المصدر يدل على الحدث دون زمن.', answer: true, explanation: 'مثل: كتابة، قراءة، دراسة.' },
      { type: 'mcq', prompt: 'مصدر الفعل «قرأَ» هو…', options: ['قراءة', 'قارئ', 'مقروء'], answer: 0, explanation: 'قراءة مصدر.' },
    ],
    6: [
      { type: 'mcq', prompt: 'الفعل «كتبوا» فعل…', options: ['ماضٍ', 'مضارع', 'أمر'], answer: 0, explanation: 'واو الجماعة مع الماضي: كتبوا.' },
      { type: 'fill', prompt: 'الفعل الماضي للمفرد الغائب: ____ (من جذر د ر س)', accept: ['درس', 'درسَ'], explanation: 'درسَ.' },
    ],
    7: [
      { type: 'mcq', prompt: 'المضارع من «كتبَ» للمفرد المتكلم هو…', options: ['أكتبُ', 'يكتبُ', 'نكتبُ'], answer: 0, explanation: 'الهمزة للمتكلم المفرد.' },
      { type: 'mcq', prompt: 'فعل الأمر من «كتبَ» هو…', options: ['اكتبْ', 'يكتبُ', 'كتبَ'], answer: 0, explanation: 'اكتبْ للمخاطب.' },
    ],
  },
  'imla-without-mistakes': {
    0: [
      { type: 'mcq', prompt: 'همزة «أكل» همزة…', options: ['قطع', 'وصل'], answer: 0, explanation: 'تُنطق دائمًا وتُكتب أ.' },
      { type: 'mcq', prompt: 'همزة «استمع» همزة…', options: ['قطع', 'وصل'], answer: 1, explanation: 'تسقط في وسط الكلام، فهي همزة وصل.' },
      { type: 'tf', prompt: 'همزة الوصل تُنطق في بداية الكلام وتسقط في وسطه.', answer: true, explanation: 'مثل: اكتبْ، فاكتبْ.' },
    ],
    1: [
      { type: 'mcq', prompt: 'الصواب في كتابة الكلمة…', options: ['سؤال', 'سوال', 'سئال'], answer: 0, explanation: 'الهمزة مفتوحة بعد حرف مضموم، والضمة أقوى، فتُكتب على واو.' },
      { type: 'mcq', prompt: 'الصواب في كتابة الكلمة…', options: ['مسئول', 'مسؤول'], answer: 1, explanation: 'الهمزة مضمومة بعد حرف مفتوح، والضمة أقوى، فتُكتب على واو.' },
    ],
    2: [
      { type: 'mcq', prompt: 'الصواب في كتابة الكلمة…', options: ['شاطئ', 'شاطىء', 'شاطء'], answer: 0, explanation: 'الهمزة مكسورة، فتُكتب على ياء (ئ).' },
      { type: 'mcq', prompt: 'الصواب في كتابة الكلمة…', options: ['جزء', 'جزأ'], answer: 0, explanation: 'الهمزة المتطرفة بعد ساكن تكتب على السطر.' },
    ],
    3: [
      { type: 'mcq', prompt: '«مدرسة» تنتهي بـ…', options: ['تاء مربوطة', 'تاء مفتوحة', 'هاء'], answer: 0, explanation: 'تنطق هاء عند الوقف: مدرسه.' },
      { type: 'fill', prompt: 'نكتب «فتا__» بتاء مربوطة أم مفتوحة؟ اكتب: مربوطة أو مفتوحة', accept: ['مربوطة'], explanation: 'فتاة اسم مفرد مؤنث.' },
    ],
    4: [
      { type: 'mcq', prompt: 'التاء في «بيت» تاء…', options: ['مفتوحة', 'مربوطة'], answer: 0, explanation: 'بيت: التاء أصلية وتبقى تاءً عند الوقف.' },
      { type: 'tf', prompt: 'التاء في «أخوات» تاء مفتوحة.', answer: true, explanation: 'جمع مؤنث سالم، وتبقى تاء.' },
    ],
    5: [
      { type: 'match', prompt: 'اختر التاء الصحيحة.', pairs: [['شجر__', 'ة'], ['بي__', 'ت'], ['معلم__', 'ة']], explanation: 'المفرد المؤنث غالبًا بتاء مربوطة.' },
    ],
    6: [
      { type: 'mcq', prompt: 'الألف في «موسى» تُكتب…', options: ['مقصورة (ى)', 'ممدودة (ا)'], answer: 0, explanation: 'ألفها تُرسم ياءً (ى) في آخر الاسم الثلاثي إن كان أصلها ياء، وفي «موسى» تُكتب ألفًا مقصورة بالاتفاق.' },
      { type: 'mcq', prompt: 'الألف في «مصطفى» تُكتب…', options: ['ى', 'ا'], answer: 0, explanation: 'الاسم يزيد على ثلاثة أحرف وأصلها ياء: مصطفى.' },
    ],
    7: [
      { type: 'mcq', prompt: 'الصواب في كتابة الكلمة…', options: ['دعا', 'دعى'], answer: 0, explanation: 'الأصل واو: دعا يدعو.' },
      { type: 'mcq', prompt: 'الصواب في كتابة الكلمة…', options: ['رمى', 'رما'], answer: 0, explanation: 'الأصل ياء: رمى يرمي.' },
    ],
  },
  'balagha-eloquence': {
    0: [
      { type: 'mcq', prompt: 'جملة «العلمُ نافعٌ» جملة…', options: ['خبرية', 'إنشائية'], answer: 0, explanation: 'تحتمل الصدق والكذب، فهي خبر.' },
      { type: 'mcq', prompt: 'جملة «اجتهدْ في دروسك» جملة…', options: ['خبرية', 'إنشائية'], answer: 1, explanation: 'أمر، والأمر من الإنشاء الطلبي.' },
      { type: 'tf', prompt: 'الخبر يحتمل الصدق والكذب.', answer: true, explanation: 'هذا هو الفرق بينه وبين الإنشاء.' },
    ],
    1: [
      { type: 'mcq', prompt: 'في «في الدار زيدٌ» تقدّم…', options: ['الخبر على المبتدأ', 'الفاعل على الفعل', 'المفعول على الفاعل'], answer: 0, explanation: 'تقدّم شبه الجملة «في الدار» وهو الخبر.' },
      { type: 'tf', prompt: 'التقديم والتأخير قد يفيد الاهتمام أو الحصر.', answer: true, explanation: 'مثل: «إياك نعبد».' },
    ],
    2: [
      { type: 'mcq', prompt: 'القصر هو…', options: ['تخصيص أمر بآخر بطريق مخصوص', 'تكرار الحرف', 'حذف الفاعل'], answer: 0, explanation: 'مثل: «ما محمدٌ إلا رسولٌ».' },
      { type: 'mcq', prompt: 'أداة القصر في «ما نجح إلا المجتهدُ» هي…', options: ['ما وإلا', 'قد', 'لم'], answer: 0, explanation: 'النفي والاستثناء من طرق القصر.' },
    ],
    3: [
      { type: 'mcq', prompt: '«محمدٌ كالأسدِ في الشجاعة»: أداة التشبيه هي…', options: ['الكاف', 'في', 'محمد'], answer: 0, explanation: 'الكاف أداة تشبيه، والأسد مشبّه به.' },
      { type: 'match', prompt: 'صل كل ركن بمثاله في «العلمُ كالنورِ في الهداية».', pairs: [['المشبه', 'العلم'], ['المشبه به', 'النور'], ['أداة التشبيه', 'الكاف'], ['وجه الشبه', 'الهداية']], explanation: 'للتشبيه أربعة أركان.' },
    ],
    4: [
      { type: 'mcq', prompt: '«رأيتُ أسدًا يخطب في الناس» فيها…', options: ['استعارة', 'جناس', 'طباق'], answer: 0, explanation: 'شبّه الرجل الشجاع بالأسد وحذف المشبه.' },
      { type: 'tf', prompt: 'الاستعارة تشبيه حُذف أحد طرفيه.', answer: true, explanation: 'ويُترك الآخر مع قرينة.' },
    ],
    5: [
      { type: 'mcq', prompt: '«فلان كثيرُ الرماد» كناية عن…', options: ['الكرم', 'الفقر', 'الغضب'], answer: 0, explanation: 'كثرة الرماد تدل على كثرة الطبخ والضيافة.' },
      { type: 'tf', prompt: 'في الكناية يجوز إرادة المعنى الحقيقي مع المعنى المراد.', answer: true, explanation: 'وهذا ما يفرّقها عن المجاز.' },
    ],
    6: [
      { type: 'mcq', prompt: 'الجناس هو تشابه لفظين مع…', options: ['اختلاف المعنى', 'اتفاق المعنى', 'اتفاق الوزن فقط'], answer: 0, explanation: 'مثل: «الفتى والفتى».' },
    ],
    7: [
      { type: 'mcq', prompt: 'السجع هو…', options: ['توافق الفواصل في الحرف الأخير', 'ذكر الضدين', 'تشبيه بلا أداة'], answer: 0, explanation: 'مثل: «من جدّ وجد، ومن زرع حصد».' },
    ],
    8: [
      { type: 'mcq', prompt: 'الطباق في «الليلُ والنهارُ» بين…', options: ['الليل والنهار', 'الليل والليل', 'النهار والنهار'], answer: 0, explanation: 'جمع بين لفظين متضادين.' },
      { type: 'match', prompt: 'صل الكلمة بضدها.', pairs: [['الصدق', 'الكذب'], ['الحياة', 'الموت'], ['الفرح', 'الحزن']], explanation: 'الطباق جمع الضدين.' },
    ],
  },
  'arabic-for-non-natives-beginner': {
    0: [
      { type: 'mcq', prompt: 'Which letter is Alif?', options: ['ا', 'ب', 'ت'], answer: 0, explanation: 'Alif is the first letter: ا.' },
      { type: 'match', prompt: 'Match each letter with its name.', pairs: [['ب', 'Baa'], ['ت', 'Taa'], ['ث', 'Thaa']], explanation: 'They share a shape and differ in the dots.' },
      { type: 'tf', prompt: 'Arabic is written from right to left.', answer: true, explanation: 'Yes. Start on the right side of the page.' },
    ],
    1: [
      { type: 'mcq', prompt: 'Which letter has one dot above?', options: ['ن', 'ب', 'ي'], answer: 0, explanation: 'Noon ن has one dot above; baa ب has one below.' },
      { type: 'match', prompt: 'Match each letter with its name.', pairs: [['ج', 'Jeem'], ['ح', 'Haa'], ['خ', 'Khaa']], explanation: 'Same shape, different dots.' },
    ],
    2: [
      { type: 'mcq', prompt: 'The short vowel fatha looks like…', options: ['a small line above the letter', 'a small line below', 'a small loop'], answer: 0, explanation: 'Fatha (a) is above: بَ = ba.' },
      { type: 'match', prompt: 'Match the mark with its sound.', pairs: [['بَ', 'ba'], ['بِ', 'bi'], ['بُ', 'bu']], explanation: 'Fatha = a, kasra = i, damma = u.' },
    ],
    3: [
      { type: 'mcq', prompt: 'How do you say "peace be upon you"?', options: ['السلام عليكم', 'شكرًا', 'مع السلامة'], answer: 0, explanation: 'The standard Arabic greeting.' },
      { type: 'match', prompt: 'Match the Arabic with the meaning.', pairs: [['شكرًا', 'Thank you'], ['مرحبًا', 'Hello'], ['مع السلامة', 'Goodbye']], explanation: 'Everyday words to know.' },
      { type: 'fill', prompt: 'Type "thank you" in Arabic.', accept: ['شكرا', 'شكراً'], explanation: 'شكرًا.' },
    ],
    4: [
      { type: 'match', prompt: 'Match the number.', pairs: [['١', 'one'], ['٢', 'two'], ['٣', 'three']], explanation: 'Arabic-Indic digits.' },
      { type: 'mcq', prompt: 'What is "واحد"?', options: ['one', 'two', 'ten'], answer: 0, explanation: 'واحد means one.' },
    ],
    5: [
      { type: 'match', prompt: 'Match the family word.', pairs: [['أب', 'father'], ['أم', 'mother'], ['أخ', 'brother'], ['أخت', 'sister']], explanation: 'Core family words.' },
      { type: 'mcq', prompt: 'What is "أخت"?', options: ['sister', 'mother', 'brother'], answer: 0, explanation: 'أخت means sister.' },
    ],
  },
  'irab-in-practice': {
    0: [
      { type: 'mcq', prompt: 'الإعراب هو…', options: ['تغيّر أواخر الكلمات بتغيّر موقعها في الجملة', 'تغيّر أوائل الكلمات', 'ترتيب الحروف الهجائية'], answer: 0, explanation: 'يظهر أثره في آخر الكلمة.' },
      { type: 'tf', prompt: 'الحرف في الجملة يُعرب إعراب الاسم المتغيّر.', answer: false, explanation: 'الحروف مبنية في الغالب.' },
    ],
    1: [
      { type: 'match', prompt: 'صل الحالة بعلامتها الأصلية في الاسم المفرد.', pairs: [['الرفع', 'الضمة'], ['النصب', 'الفتحة'], ['الجر', 'الكسرة']], explanation: 'هذه العلامات الأصلية.' },
      { type: 'mcq', prompt: 'علامة الجزم الأصلية في الفعل المضارع هي…', options: ['السكون', 'الكسرة', 'الفتحة'], answer: 0, explanation: 'مثل: لم يكتبْ.' },
    ],
    2: [
      { type: 'mcq', prompt: 'المثنى يُرفع بـ…', options: ['الألف', 'الياء', 'الواو'], answer: 0, explanation: 'جاء الطالبانِ.' },
      { type: 'mcq', prompt: 'جمع المذكر السالم يُرفع بـ…', options: ['الواو', 'الألف', 'الكسرة'], answer: 0, explanation: 'جاء المعلمون.' },
    ],
    3: [
      { type: 'mcq', prompt: 'المثنى في حالة النصب والجر يكون بـ…', options: ['الياء', 'الألف', 'الواو'], answer: 0, explanation: 'رأيتُ الطالبَينِ، مررتُ بالطالبَينِ.' },
      { type: 'tf', prompt: 'جمع المؤنث السالم يُنصب بالكسرة.', answer: true, explanation: 'رأيتُ المعلماتِ.' },
    ],
    4: [
      { type: 'mcq', prompt: 'الكلمة الممنوعة من الصرف تُجر بـ…', options: ['الفتحة', 'الكسرة', 'الضمة'], answer: 0, explanation: 'مررتُ بأحمدَ.' },
      { type: 'tf', prompt: 'جمع التكسير يُعرب بالحركات الظاهرة غالبًا.', answer: true, explanation: 'مثل: جاءت الكتبُ.' },
    ],
    5: [
      { type: 'mcq', prompt: 'الفعل الماضي يكون…', options: ['مبنيًا', 'معربًا'], answer: 0, explanation: 'يُبنى على الفتح أو السكون أو الضم.' },
      { type: 'mcq', prompt: 'فعل الأمر يُبنى على…', options: ['السكون في الصحيح', 'الكسرة دائمًا', 'الفتحة دائمًا'], answer: 0, explanation: 'مثل: اكتبْ.' },
    ],
    6: [
      { type: 'mcq', prompt: 'الفعل المضارع يكون مرفوعًا إذا…', options: ['لم يسبقه ناصب أو جازم', 'سبقته أنْ', 'سبقته لم'], answer: 0, explanation: 'مثل: يكتبُ الطالبُ.' },
    ],
    7: [
      { type: 'match', prompt: 'صل الأداة بعملها.', pairs: [['أنْ', 'تنصب المضارع'], ['لم', 'تجزم المضارع'], ['لن', 'تنصب المضارع']], explanation: 'أنْ ولن للنصب، ولم للجزم.' },
      { type: 'fill', prompt: 'لم يكتبْ: الفعل بعد «لم» يكون ____', accept: ['مجزوما', 'مجزوم'], explanation: 'لم تجزم المضارع.' },
    ],
  },
  'nahw-revision-secondary': {
    0: [
      { type: 'mcq', prompt: '«العلمُ نورٌ» جملة…', options: ['اسمية', 'فعلية'], answer: 0, explanation: 'تبدأ باسم.' },
      { type: 'mcq', prompt: '«ذهبَ الطالبُ» جملة…', options: ['فعلية', 'اسمية'], answer: 0, explanation: 'تبدأ بفعل.' },
    ],
    1: [
      { type: 'match', prompt: 'صل كل مرفوع بمثاله.', pairs: [['فاعل', 'جاءَ زيدٌ'], ['مبتدأ', 'الجوُّ جميلٌ'], ['نائب فاعل', 'كُتبَ الدرسُ']], explanation: 'من المرفوعات.' },
    ],
    2: [
      { type: 'mcq', prompt: 'في «قرأتُ الكتابَ» الكتابَ…', options: ['مفعول به', 'فاعل', 'حال'], answer: 0, explanation: 'وقع عليه فعل القراءة.' },
      { type: 'mcq', prompt: '«كان الجوُّ جميلًا»: جميلًا…', options: ['خبر كان منصوب', 'حال', 'تمييز'], answer: 0, explanation: 'خبر كان يُنصب.' },
    ],
    3: [
      { type: 'mcq', prompt: 'في «كتابُ الطالبِ» الطالبِ…', options: ['مضاف إليه مجرور', 'فاعل', 'مفعول به'], answer: 0, explanation: 'المضاف إليه دائمًا مجرور.' },
      { type: 'tf', prompt: 'المضاف إليه مجرور دائمًا.', answer: true, explanation: 'تحفظ هذه القاعدة.' },
    ],
    4: [
      { type: 'mcq', prompt: 'التوابع هي…', options: ['النعت والعطف والتوكيد والبدل', 'الفاعل والمفعول', 'المبتدأ والخبر'], answer: 0, explanation: 'أربعة توابع.' },
    ],
    5: [
      { type: 'mcq', prompt: 'في «جاء الطلابُ كلُّهم» كلُّهم…', options: ['توكيد', 'حال', 'تمييز'], answer: 0, explanation: 'توكيد معنوي.' },
    ],
    6: [
      { type: 'mcq', prompt: '«ما أجملَ السماءَ!» أسلوب…', options: ['تعجب', 'استفهام', 'نداء'], answer: 0, explanation: 'ما أفعلَه صيغة تعجب.' },
    ],
    7: [
      { type: 'mcq', prompt: 'في «جاء الولدُ ضاحكًا» ضاحكًا…', options: ['حال', 'نعت', 'تمييز'], answer: 0, explanation: 'تبيّن هيئة الفاعل وقت الفعل.' },
      { type: 'mcq', prompt: 'في «جاء ولدٌ مجتهدٌ» مجتهدٌ…', options: ['نعت', 'حال', 'خبر'], answer: 0, explanation: 'تابع لما قبله في الإعراب.' },
    ],
    8: [
      { type: 'mcq', prompt: 'في «اشتريتُ عشرينَ كتابًا» كتابًا…', options: ['تمييز', 'حال', 'نعت'], answer: 0, explanation: 'يزيل الإبهام عن العدد.' },
      { type: 'mcq', prompt: 'المستثنى بـ «إلا» في الكلام التام المثبت يكون…', options: ['منصوبًا', 'مرفوعًا', 'مجرورًا'], answer: 0, explanation: 'جاء الطلابُ إلا زيدًا.' },
    ],
  },
  'reading-fluency': {
    0: [
      { type: 'mcq', prompt: 'ضبط الحركات يساعد على…', options: ['قراءة صحيحة وفهم أدق', 'القراءة بسرعة فقط', 'حذف الحروف'], answer: 0, explanation: 'الحركة قد تغيّر المعنى.' },
      { type: 'tf', prompt: 'الوقوف عند نهاية الجملة يساعد على الفهم.', answer: true, explanation: 'الوقف المناسب جزء من الطلاقة.' },
    ],
    1: [
      { type: 'mcq', prompt: 'الحرف الذي يخرج من الشفتين هو…', options: ['ب', 'ك', 'ح'], answer: 0, explanation: 'الباء والميم والواو شفوية.' },
      { type: 'match', prompt: 'صل الحرف بصفته.', pairs: [['ب', 'من الشفتين'], ['ك', 'من أقصى اللسان'], ['ع', 'من الحلق']], explanation: 'تعرّف المخارج.' },
    ],
    3: [
      { type: 'mcq', prompt: 'أواخر الكلمات تتغير حسب…', options: ['موقعها في الجملة', 'طول الكلمة', 'عدد الحروف'], answer: 0, explanation: 'هذا هو الإعراب.' },
    ],
    4: [
      { type: 'tf', prompt: 'القراءة الجيدة سريعة جدًا دائمًا.', answer: false, explanation: 'الأفضل سرعة مناسبة مع فهم صحيح.' },
    ],
  },
  'essay-writing': {
    0: [
      { type: 'mcq', prompt: 'قبل الكتابة نحدد…', options: ['الفكرة والهدف', 'عدد الأسطر فقط', 'لون الورق'], answer: 0, explanation: 'الهدف يوجّه المقال.' },
      { type: 'tf', prompt: 'معرفة الجمهور تغيّر أسلوب الكتابة.', answer: true, explanation: 'نكتب لطالب غير ما نكتب لمدير.' },
    ],
    1: [
      { type: 'mcq', prompt: 'المقدمة الجيدة…', options: ['تعرّف بالموضوع وتشوّق القارئ', 'تلخص كل النتائج', 'تكرر العنوان فقط'], answer: 0, explanation: 'هي مدخل المقال.' },
      { type: 'mcq', prompt: 'الخاتمة الجيدة…', options: ['تلخص الفكرة وتترك أثرًا', 'تضيف موضوعًا جديدًا طويلًا', 'تبدأ بالمقدمة'], answer: 0, explanation: 'تغلق المقال بإحكام.' },
    ],
    2: [
      { type: 'match', prompt: 'صل الأسلوب بغرضه.', pairs: [['الوصف', 'تصوير الشيء'], ['السرد', 'رواية الأحداث'], ['الإقناع', 'إقناع القارئ برأي']], explanation: 'لكل أسلوب غرض.' },
    ],
    3: [
      { type: 'tf', prompt: 'مراجعة المقال بعد الكتابة تقلل الأخطاء.', answer: true, explanation: 'اقرأ المقال مرة أخيرة قبل التسليم.' },
      { type: 'order', prompt: 'رتّب أجزاء المقال.', answers: [['المقدمة', 'العرض', 'الخاتمة']], explanation: 'هذا الترتيب المعتاد.' },
    ],
  },
  'arabic-conversation-daily-life': {
    0: [
      { type: 'mcq', prompt: 'نرد على «السلام عليكم» بـ…', options: ['وعليكم السلام', 'مع السلامة', 'شكرًا'], answer: 0, explanation: 'رد التحية.' },
      { type: 'fill', prompt: 'كيف حالك؟ — أنا بخير، ____ لله', accept: ['الحمد'], explanation: 'الحمد لله.' },
    ],
    1: [
      { type: 'match', prompt: 'صل الكلمة بمعناها.', pairs: [['أم', 'mother'], ['أب', 'father'], ['بيت', 'house']], explanation: 'كلمات البيت.' },
    ],
    2: [
      { type: 'mcq', prompt: 'للسؤال عن الوقت نقول…', options: ['كم الساعة؟', 'ما اسمك؟', 'أين تسكن؟'], answer: 0, explanation: 'سؤال شائع.' },
    ],
    3: [
      { type: 'mcq', prompt: 'في السوق نسأل عن السعر بقولنا…', options: ['بكم هذا؟', 'كم الساعة؟', 'أين المحطة؟'], answer: 0, explanation: 'بكم هذا؟ أي كم ثمنه؟' },
    ],
    4: [
      { type: 'mcq', prompt: 'في المطعم نطلب الطعام بقولنا…', options: ['أريد من فضلك…', 'مع السلامة', 'كم عمرك؟'], answer: 0, explanation: 'أريد، من فضلك.' },
    ],
  },
};
