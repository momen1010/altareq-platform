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
};
