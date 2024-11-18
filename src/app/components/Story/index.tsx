export const Story = () => {
  return (
    <div className="flex gap-32 p-5 px-32 h-full items-center">
      <div className='w-full flex-1 flex justify-center'>
        <div className="flex justify-center w-96 gap-8 flex-col">
          <h1 className='text-2xl'>
            Lorem Ipsum is simply dummy text of the printing.
          </h1>
          <div className="h-[400px] full bg-gray-300 rounded-xl"></div>
        </div>
      </div>

      <div className="p-5 flex-1">
        <div className='flex flex-col gap-6'>
          <h5 className='uppercase font-semibold'>My Story</h5>
          <div className='text-gray-400 tracking-normal flex gap-6 flex-col'>
            <p>
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
            </p>
            <p>
              The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}