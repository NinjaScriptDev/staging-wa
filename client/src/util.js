import { countries } from "@/country-list";

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
export const emailJS_serviceId = import.meta.env.VITE_EMAILJS_SERVICEID;
export const emailJS_templateId = import.meta.env.VITE_EMAILJS_TEMPLATEID;
export const emailJS_userId = import.meta.env.VITE_EMAILJS_USERID;

export const formatDateFromTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${day}-${month}-${year}`;
};

export const formatTimeFromDate = (currentDate) => {
  return `${currentDate.getHours()}:${currentDate.getMinutes()}`;
};

export const formatTimeFromTime = (time) => {
  return time?.slice(0, 5);
};

export const formatDate = (date) => {
  const eventDate = new Date(date);
  const day = eventDate.getDate();
  return day;
};

export const formatMonthYear = (date) => {
  const eventDate = new Date(date);
  const options = { year: "numeric", month: "long" };
  return eventDate.toLocaleDateString("en-US", options);
};

export const formatMonthDate = (date) => {
  const eventDate = new Date(date);
  const options = { day: "numeric", month: "long" };
  return eventDate.toLocaleDateString("en-US", options);
};

export const getEventImageUrl = (imageName) => {
  return imageName != null
    ? `${apiBaseUrl}/static/event/${imageName}`
    : "/src/assets/img/default-event.jpg";
};

export const getUserImageUrl = (imageName) => {
  return imageName === "null" || !imageName
    ? "/src/assets/img/default-profile.jpg"
    : `${apiBaseUrl}/static/user/${imageName}`;
};

export const getBlogImageUrl = (imageName) => {
  return imageName === "null" || !imageName
    ? "/src/assets/img/default-blog.jpg"
    : `${apiBaseUrl}/static/blog/${imageName}`;
};

export const getToLink = (item) => {
  if (item.to.params) {
    const paramKey = Object.keys(item.to.params)[0];
    const paramVal = item.to.params[paramKey];
    return {
      name: item.to.name,
      params: { [paramKey]: paramVal },
    };
  }
  return item.to;
};

export const getCountryList = (filterName) => {
  if (filterName === "both") return countries;
  return countries.map((item) => item[filterName]);
};

export const removeQueryParams = (url, paramsToRemove) => {
  const parsedUrl = new URL(url);

  // Create a URLSearchParams object from the URL's search parameters
  const searchParams = new URLSearchParams(parsedUrl.search);

  // Remove the specified query parameters
  paramsToRemove.forEach((param) => {
    searchParams.delete(param);
  });

  // Construct the new URL with the updated search parameters
  parsedUrl.search = searchParams.toString();

  // Return the updated URL as a string
  return parsedUrl.toString();
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
