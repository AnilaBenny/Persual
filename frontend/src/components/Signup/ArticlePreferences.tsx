import { AiOutlineClose } from 'react-icons/ai';
import { Field, ErrorMessage } from 'formik';

const ArticlePreferences = ({ values, setFieldValue }:any) => {
  const preferences = ['Technology', 'Science', 'Business', 'Entertainment', 'Sports', 'Politics', 'Health', 'Travel'];

  const handlePreferenceChange = (e:any) => {
    const { value } = e.target;
    if (value && !values.articlePreferences.includes(value)) {
      setFieldValue('articlePreferences', [...values.articlePreferences, value]);
    }
  };

  const removePreference = (pref:any) => {
    setFieldValue(
      'articlePreferences',
      values.articlePreferences.filter((p:any) => p !== pref)
    );
  };

  return (
    <div>
      <label htmlFor="articlePreferences" className="block text-sm font-medium text-gray-700">Article Preferences</label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <Field
          as="select"
          name="articlePreferences"
          id="articlePreferences"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={handlePreferenceChange}
          value=""
        >
          <option value="">Select preferences</option>
          {preferences.map((pref) => (
            <option key={pref} value={pref}>
              {pref}
            </option>
          ))}
        </Field>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.articlePreferences.map((pref:any) => (
          <span
            key={pref}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {pref}
            <button
              type="button"
              onClick={() => removePreference(pref)}
              className="ml-1 inline-flex items-center justify-center w-4 h-4 text-blue-400 hover:bg-blue-200 hover:text-blue-500 rounded-full focus:outline-none"
            >
              <AiOutlineClose className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <ErrorMessage name="articlePreferences" component="p" className="mt-1 text-sm text-red-600" />
    </div>
  );
};

export default ArticlePreferences;